const express = require('express')
const Q = require('q')
const winston = require('winston')
const { genCSRF } = require('../lib/controllerutils')
const contactFormService = require('../services/contactformservice')
const { contactLabels } = require('../labels/contactlabels')
const metadataRepository = require('../repositorys/metadatarepository')
const companyRepository = require('../repositorys/companyrepository')

const router = express.Router()

/**
 * GET the edit detail screen, used for editing contacts.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
function editDetails (req, res, next) {
  Q.spawn(function * () {
    try {
      const token = req.session.token

      // Work out what to use for the form data
      // This can either be data recently posted, to be re-rendered with errors
      // or a contact that the user wishes to edit
      // or a new contact for a company
      if (typeof req.body === 'object' && Object.keys(req.body).length > 0) {
        res.locals.formData = req.body
        res.locals.company = yield companyRepository.getDitCompany(token, req.body.company)
      } else if (res.locals.contact) {
        res.locals.formData = contactFormService.getContactAsFormData(res.locals.contact)
        res.locals.company = res.locals.contact.company
      } else if (req.query.company) {
        res.locals.company = yield companyRepository.getDitCompany(token, req.query.company)
        res.locals.formData = { company: res.locals.company.id }
      } else {
        return next('Unable to edit contact')
      }

      if (req.params.contactId) {
        res.locals.backUrl = `/contact/${req.params.contactId}/details`
      } else if (req.query.company) {
        res.locals.backUrl = `/company/company_company/${req.query.company}/contacts`
      }

      // Labels and options needed for the form and error display
      res.locals.contactLabels = contactLabels
      res.locals.countryOptions = metadataRepository.countryOptions

      genCSRF(req, res)
      res.render('contact/edit')
    } catch (error) {
      winston.error(error)
      next(error)
    }
  })
}


/**
 * POST contact form. Accepts a contact form and saves it to the backend
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
function postDetails (req, res, next) {
  return new Promise((resolve, reject) => {
    Q.spawn(function * () {
      // Try and save the form data, if it fails
      // then attach the errors to the response and re-render edit
      try {
        const contact = yield contactFormService.saveContactForm(req.session.token, req.body)
        res.redirect(`/contact/${contact.id}/details`)
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
  })
}

router.get(['/contact/:contactId/edit', '/contact/add'], editDetails)
router.post(['/contact/:contactId/edit', '/contact/add'], postDetails)

module.exports = {router, editDetails, postDetails}
