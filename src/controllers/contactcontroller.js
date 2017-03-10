const express = require('express')
const Q = require('q')
const winston = require('winston')

const contactRepository = require('../repositorys/contactrepository')
const controllerUtils = require('../lib/controllerutils')

const router = express.Router()

function getCommon (req, res, next) {
  const id = req.params.contactId
  const csrfToken = controllerUtils.genCSRF(req, res)
  contactRepository.getContact(req.session.token, id)
  .then((contact) => {
    res.locals.id = id
    res.locals.contact = contact
    res.locals.csrfToken = csrfToken
    next()
  })
  .catch((error) => {
    winston.error(error)
    next()
  })
}

function getDetails (req, res, next) {
  try {
    res.render('contact/details', {
      tab: 'details'
    })
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

module.exports = {router}
