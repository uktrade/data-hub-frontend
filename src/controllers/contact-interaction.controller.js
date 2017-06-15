const express = require('express')
const Q = require('q')

const interactionFormattingService = require('../services/interaction-formatting.service')
const contactDataService = require('../services/contact-data.service')
const { getCommon } = require('./contact.controller')
const router = express.Router()

function getInteractions (req, res, next) {
  Q.spawn(function * () {
    try {
      res.locals.tab = 'interactions'
      const interactions = yield contactDataService.getContactInteractionsAndServiceDeliveries(req.session.token, req.params.contactId)
      res.locals.interactions = interactions.map(interaction => interactionFormattingService.getDisplayContactInteraction(interaction))
      res.locals.addInteractionUrl = `/interaction/add-step-1/?contact=${res.locals.contact.id}`

      res.locals.title.unshift('Interactions')

      res.render('contact/interactions')
    } catch (error) {
      next(error)
    }
  })
}

router.get('/contact-interactions/:contactId', getCommon, getInteractions)

module.exports = { router, getInteractions }
