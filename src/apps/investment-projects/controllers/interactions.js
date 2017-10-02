const { getInteractionsForInvestment } = require('../../interactions/repos')
const { transformInteractionToListItem } = require('../../interactions/transformers')
const { transformApiResponseToCollection } = require('../../transformers')

async function renderInteractionList (req, res, next) {
  try {
    const token = req.session.token
    const page = req.query.page || '1'
    const investmentId = req.params.id

    const interactions = await getInteractionsForInvestment(token, investmentId, page)
      .then(transformApiResponseToCollection(
        { entityType: 'interaction' },
        transformInteractionToListItem
      ))

    return res
      .breadcrumb('Interactions')
      .render('investment-projects/views/interactions', {
        interactions,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderInteractionList,
}
