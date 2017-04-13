const express = require('express')
const Q = require('q')

const { genCSRF } = require('../lib/controllerutils')
const contactFormService = require('../services/contactformservice')
const { contactDetailsLabels } = require('../labels/contactlabels')
const metadataRepository = require('../repositorys/metadatarepository')

const router = express.Router()

function editDetails (req, res, next) {
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
    } else if (!req.params.company) {
      return next('Provide a company for the contact')
    } else {
      res.locals.contactFormData = {
        company: req.params.company
      }
    }

    // Labels and options needed for the form and error display
    res.locals.contactDetailsLabels = contactDetailsLabels
    res.locals.countryOptions = metadataRepository.countryOptions

    res.render('contact/edit')
  } catch (errors) {
    res.locals.errors = errors
    next(errors)
  }
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
          res.locals.errors = errors.error
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
