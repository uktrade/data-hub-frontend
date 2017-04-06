const express = require('express')
const winston = require('winston')

const contactService = require('../services/contactservice')
const contactFormattingService = require('../services/contactformattingservice')
const { contactDetailsLabels } = require('../labels/contactlabels')
const router = express.Router()

function getCommon (req, res, next) {
  const id = req.params.contactId
  contactService.getInflatedContact(req.session.token, id)
  .then((contact) => {
    res.locals.id = id
    res.locals.contact = contact
    next()
  })
  .catch((error) => {
    winston.error(error)
    res.render('error', { error: 'Error loading contact' })
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

function editDetails (req, res, next) {
  res.render('contact/edit')
}

function postDetails (req, res, next) {
}

function getInteractions (req, res, next) {

}

router.use(['/contact/:contactId/*'], getCommon)
router.get(['/contact/:contactId/edit', '/contact/add'], editDetails)
router.post(['/contact/:contactId/edit', '/contact/add'], postDetails)
router.get('/contact/:contactId/details', getDetails)
router.get('/contact/:contactId/interactions', getInteractions)

module.exports = {router, getDetails}
