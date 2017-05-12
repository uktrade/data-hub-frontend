const express = require('express')
const winston = require('winston')
const Q = require('q')

const { genCSRF } = require('../lib/controllerutils')
const contactRepository = require('../repos/contact.repo')
const contactFormattingService = require('../services/contact-formatting.service')
const companyService = require('../services/company.service')
const { contactDetailsLabels } = require('../labels/contactlabels')
const router = express.Router()

const reasonForArchiveOptions = [
  'Contact has left the company',
  'Contact does not want to be contacted',
  'Contact changed role/responsibility'
]

function getCommon (req, res, next) {
  return new Promise((resolve, reject) => {
    Q.spawn(function * () {
      try {
        res.locals.id = req.params.contactId
        res.locals.contact = yield contactRepository.getContact(req.session.token, req.params.contactId)
        res.locals.companyUrl = companyService.getViewCompanyLink(res.locals.contact.company)
        res.locals.reasonForArchiveOptions = reasonForArchiveOptions
        genCSRF(req, res)
        next()
      } catch (error) {
        winston.error(error)
        res.render('error', { error })
      }
    })
  })
}

function getDetails (req, res, next) {
  try {
    res.locals.tab = 'details'
    res.locals.contactDetails = contactFormattingService.getDisplayContact(res.locals.contact)
    res.locals.contactDetailsLabels = contactDetailsLabels
    res.locals.contactDetailsDisplayOrder = Object.keys(res.locals.contactDetails)
    res.render('contact/details')
  } catch (error) {
    next(error)
  }
}

router.get('/contact/:contactId/details', getCommon, getDetails)

module.exports = {router, getDetails, getCommon}
