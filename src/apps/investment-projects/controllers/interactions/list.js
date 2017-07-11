const { get } = require('lodash')

const { getDisplayCompanyInteraction } = require('../../../interactions/services/formatting')
const { getInteractionsForInvestment } = require('../../../interactions/repos')

async function indexGetHandler (req, res, next) {
  try {
    if (get(res, 'locals.investmentData')) {
      const interactionsResponse = await getInteractionsForInvestment(req.session.token, req.params.id)
      const interactions = interactionsResponse.results.map(getDisplayCompanyInteraction)

      return res
        .breadcrumb('Interactions')
        .render('investment-projects/views/interactions/index', {
          currentNavItem: 'interactions',
          interactions,
        })
    }
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  indexGetHandler,
}
