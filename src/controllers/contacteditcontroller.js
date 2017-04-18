const express = require('express')
const Q = require('q')

const { genCSRF } = require('../lib/controllerutils')
const contactFormService = require('../services/contactformservice')
const { contactDetailsLabels } = require('../labels/contactlabels')
const metadataRepository = require('../repositorys/metadatarepository')
const companyRepository = require('../repositorys/companyrepository')

const router = express.Router()

function editDetails (req, res, next) {
  Q.spawn(function * () {
    try {
      genCSRF(req, res)

      // Work out what to use for the form data
      // This can either be data recently posted, to be re-rendered with errors
      // or a contact that the user wishes to edit
      // or a new contact for a company
      if (typeof req.body === 'object' && Object.keys(req.body).length > 0) {
        res.locals.contactFormData = req.body
      } else if (res.locals.contact) {
        res.locals.contactFormData = contactFormService.getContactAsFormData(res.locals.contact)
      } else if (req.query.company) {
        const company = yield companyRepository.getDitCompany(req.session.token, req.query.company)
        res.locals.contact = { company }
        res.locals.contactFormData = { company: company.id }
      } else {
        return next('Provide a company for the contact')
      }

      if (req.params.contactId) {
        res.locals.backUrl = `/contact/${req.params.contactId}/details`
      } else if (req.query.company) {
        res.locals.backUrl = `/company/company_company/${req.query.company}/contacts`
      } else if (req.body.id) {
        res.locals.backUrl = `/contact/${req.body.id}/details`
      }

      // Labels and options needed for the form and error display
      res.locals.contactDetailsLabels = contactDetailsLabels
      res.locals.countryOptions = metadataRepository.countryOptions

      res.render('contact/edit')
    } catch (errors) {
      res.locals.errors = errors
      next(errors)
    }
  })
}

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
