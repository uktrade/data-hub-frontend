const interactionFormattingService = require('../../interactions/services/formatting.service')
const contactDataService = require('../services/data.service')

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

module.exports = {
  getInteractions,
}
