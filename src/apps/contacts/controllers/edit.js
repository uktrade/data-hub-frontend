const { containsFormData } = require('../../../lib/controller-utils')
const contactFormService = require('../services/form')
const { contactLabels } = require('../labels')
const metadataRepository = require('../../../lib/metadata')
const companyRepository = require('../../companies/repos')
const { buildCompanyUrl } = require('../../companies/services/data')

/**
 * GET the edit detail screen, used for editing contacts.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
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
      res.locals.backUrl = `/contact/${req.params.contactId}/details`
      res.locals.title.unshift('Edit')
    } else if (req.query.company) {
      res.locals.backUrl = `/company-contacts/${req.query.company}`
      res.locals.title = `Add contact at ${res.locals.company.name}`
    }

    // Labels and options needed for the form and error display
    res.locals.contactLabels = contactLabels
    res.locals.countryOptions = metadataRepository.countryOptions
    res.locals.companyUrl = buildCompanyUrl(res.locals.company)

    res.render('contact/edit')
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
        req.flash('success-message', 'Updated contact record')
        res.redirect(`/contact/${req.body.id}/details`)
      } else {
        req.flash('success-message', 'Added new contact')
        res.redirect(`/company-contacts/${req.body.company}`)
      }
    } catch (errors) {
      if (errors.error) {
        if (errors.error.errors) {
          res.locals.errors = errors.error.errors
        } else {
          res.locals.errors = errors.error
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
