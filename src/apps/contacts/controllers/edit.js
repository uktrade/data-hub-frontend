const { get } = require('lodash')

const { containsFormData, isUrlSafe } = require('../../../lib/controller-utils')
const contactFormService = require('../services/form')
const { contactLabels } = require('../labels')
const companyRepository = require('../../companies/repos')
const { getOptions } = require('../../../lib/options')
const urls = require('../../../lib/urls')

/**
 * GET the edit detail screen, used for editing contacts.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
// Todo - rewrite to use form generator
async function editDetails(req, res, next) {
  try {
    const { token } = req.session
    const { contactId } = req.params

    // Work out what to use for the form data
    // This can either be data recently posted, to be re-rendered with errors
    // or a contact that the user wishes to edit
    // or a new contact for a company
    let {
      origin_type: originType,
      origin_url: originUrl,
      company: companyId,
    } = req.query

    if (containsFormData(req)) {
      companyId = req.body.company
      originUrl = req.body.origin_url

      res.locals.formData = req.body
    } else if (res.locals.contact) {
      companyId = res.locals.contact.company.id
      res.locals.formData = contactFormService.getContactAsFormData(
        res.locals.contact
      )
    } else if (companyId) {
      companyId = req.query.company
      res.locals.formData = {
        company: companyId,
      }
      if (originUrl) {
        res.locals.formData.origin_url = originUrl
      }
      if (originType) {
        res.locals.formData.origin_type = originType
      }
    } else {
      return next('Unable to edit contact')
    }

    if (!res.locals.company) {
      res.locals.company = await companyRepository.getDitCompany(
        token,
        companyId
      )
    }

    if (contactId) {
      res.locals.returnLink = urls.contacts.details(contactId)
      res.breadcrumb('Edit')
    } else if (originUrl && isUrlSafe(req, originUrl)) {
      res.locals.returnLink = originUrl
      res.breadcrumb(`Add contact at ${res.locals.company.name}`)
    } else if (companyId) {
      res.locals.returnLink = urls.companies.contacts(companyId)
      res.breadcrumb(`Add contact at ${res.locals.company.name}`)
    }

    res.locals.contactLabels = contactLabels
    res.locals.countryOptions = await getOptions(token, 'country', {
      createdOn: get(res.locals, 'contact.created_on'),
    })

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
async function postDetails(req, res, next) {
  // Try and save the form data, if it fails
  // then attach the errors to the response and re-render edit
  try {
    const { origin_type: originType, origin_url: originUrl, ...body } = req.body

    const newContact = await contactFormService.saveContactForm(
      req.session.token,
      body
    )

    if (req.body.id) {
      req.flash('success', 'Contact record updated')
    } else if (originType === 'referral') {
      req.flashWithBody(
        'success',
        `You added ${newContact.name}.`,
        'You can now continue sending the referral.'
      )
    } else if (originType === 'interaction') {
      req.flash(
        'success',
        `You added ${newContact.name}.\nYou can now continue recording the interaction.`
      )
    } else {
      req.flash('success', 'Added new contact')
    }

    const redirectUrl =
      originUrl && isUrlSafe(req, originUrl)
        ? originUrl +
          `?new-contact-name=${newContact.name}&new-contact-id=${newContact.id}`
        : urls.contacts.details(newContact.id)
    res.redirect(redirectUrl)
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

      return next()
    }

    next(errors)
  }
}

module.exports = {
  editDetails,
  postDetails,
}
