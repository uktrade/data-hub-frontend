const { getInteractionsForContact } = require('../../interactions/repos')
const { transformInteractionToListItem } = require('../../interactions/transformers')
const { transformApiResponseToCollection } = require('../../transformers')

async function getInteractionCollection (req, res, next) {
  try {
    const token = req.session.token
    const page = req.query.page || '1'
    const contactId = req.params.contactId

    res.locals.interactions = await getInteractionsForContact(token, contactId, page)
      .then(transformApiResponseToCollection(
        { entityType: 'interaction' },
        transformInteractionToListItem
      ))
  } catch (error) {
    return next(error)
  }

  next()
}

module.exports = {
  getInteractionCollection,
}
