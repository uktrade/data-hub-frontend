const interactionFormattingService = require('../../interactions/services/formatting')
const contactDataService = require('../services/data')

async function getInteractions (req, res, next) {
  try {
    res.locals.tab = 'interactions'
    const interactions = await contactDataService.getContactInteractionsAndServiceDeliveries(req.session.token, req.params.contactId)
    res.locals.interactions = interactions.map(interaction => interactionFormattingService.getDisplayContactInteraction(interaction))
    res.locals.addInteractionUrl = `/interactions/create/1?contact=${res.locals.contact.id}`

    res
      .breadcrumb('Interactions')
      .render('contacts/views/interactions')
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getInteractions,
}
