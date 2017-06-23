const express = require('express')

const interactionFormattingService = require('../../services/interaction-formatting.service')
const contactDataService = require('./contact-data.service')
const { getCommon } = require('./contact.controller')
const router = express.Router()

async function getInteractions (req, res, next) {
  try {
    res.locals.tab = 'interactions'
    const interactions = await contactDataService.getContactInteractionsAndServiceDeliveries(req.session.token, req.params.contactId)
    res.locals.interactions = interactions.map(interaction => interactionFormattingService.getDisplayContactInteraction(interaction))
    res.locals.addInteractionUrl = `/interaction/add-step-1/?contact=${res.locals.contact.id}`

    res.locals.title.unshift('Interactions')

    res.render('contact/interactions')
  } catch (error) {
    next(error)
  }
}

router.get('/contact-interactions/:contactId', getCommon, getInteractions)

module.exports = { router, getInteractions }
