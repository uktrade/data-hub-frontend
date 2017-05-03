const express = require('express')
const winston = require('winston')
const Q = require('q')

const contactRepository = require('../repositorys/contactrepository')
const contactFormattingService = require('../services/contactformattingservice')
const companyService = require('../services/companyservice')
const { contactDetailsLabels } = require('../labels/contactlabels')
const router = express.Router()

function getCommon (req, res, next) {
  return new Promise((resolve, reject) => {
    Q.spawn(function * () {
      try {
        res.locals.id = req.params.contactId
        res.locals.contact = yield contactRepository.getContact(req.session.token, res.locals.id)
        res.locals.companyUrl = companyService.getViewCompanyLink(res.locals.contact.company)
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
    res.render('contact/details')
  } catch (error) {
    next(error)
  }
}

router.get(['/contact/:contactId/*'], getCommon)
router.get('/contact/:contactId/details', getDetails)

module.exports = {router, getDetails, getCommon}
