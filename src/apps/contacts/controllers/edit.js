const { get } = require('lodash')

const { containsFormData } = require('../../../lib/controller-utils')
const contactFormService = require('../services/form')
const { contactLabels } = require('../labels')
const companyRepository = require('../../companies/repos')
const { getOptions } = require('../../../lib/options')

/**
 * GET the edit detail screen, used for editing contacts.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
// Todo - rewrite to use form generator
async function editDetails (req, res, next) {
  try {
    const token = req.session.token

    // Work out what to use for the form data
    // This can either be data recently posted, to be re-rendered with errors
    // or a contact that the user wishes to edit
    // or a new contact for a company
    let companyId

    if (containsFormData(req)) {
      companyId = req.body.company
      res.locals.formData = req.body
    } else if (res.locals.contact) {
      companyId = res.locals.contact.company.id
      res.locals.formData = contactFormService.getContactAsFormData(res.locals.contact)
    } else if (req.query.company) {
      companyId = req.query.company
      res.locals.formData = { company: req.query.company }
    } else {
      return next('Unable to edit contact')
    }

    if (!res.locals.company) {
      res.locals.company = await companyRepository.getDitCompany(token, companyId)
    }

    if (req.params.contactId) {
      res.locals.backUrl = `/contacts/${req.params.contactId}`
      res.breadcrumb('Edit')
    } else if (req.query.company) {
      res.locals.backUrl = `/companies/${req.query.company}/contacts`
      res.breadcrumb(`Add contact at ${res.locals.company.name}`)
    }

    res.locals.contactLabels = contactLabels
    res.locals.countryOptions = await getOptions(token, 'country', { createdOn: get(res.locals, 'contact.created_on') })

    res.render('contacts/views/edit')
  } catch (error) {
    next(error)
  }
}

/**
 * POST contact form. Accepts a contact form and saves it to the backend
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
function postDetails (req, res, next) {
  return new Promise(async (resolve, reject) => {
    // Try and save the form data, if it fails
    // then attach the errors to the response and re-render edit
    try {
      await contactFormService.saveContactForm(req.session.token, req.body)
      if (req.body.id) {
        req.flash('success', 'Contact record updated')
        res.redirect(`/contacts/${req.body.id}`)
      } else {
        req.flash('success', 'Added new contact')
        res.redirect(`/companies/${req.body.company}/contacts`)
      }
    } catch (errors) {
      if (errors.error) {
        if (errors.error.errors) {
          res.locals.errors = {
            messages: errors.error.errors,
          }
        } else {
          res.locals.errors = {
            messages: errors.error,
          }
        }
        editDetails(req, res, next)
      } else {
        next(errors)
      }
    }
  })
}

module.exports = {
  editDetails,
  postDetails,
}
