const { getInteractionsForInvestment } = require('../../interactions/repos')
const { transformInteractionToListItem } = require('../../interactions/transformers')
const { transformApiResponseToCollection } = require('../../transformers')

async function getInteractionCollection (req, res, next) {
  try {
    const token = req.session.token
    const page = req.query.page || '1'
    const investmentId = req.params.id

    res.locals.interactions = await getInteractionsForInvestment(token, investmentId, page)
      .then(transformApiResponseToCollection(
        { entityType: 'interaction' },
        transformInteractionToListItem
      ))

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getInteractionCollection,
}
