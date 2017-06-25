const { get } = require('lodash')

const { getDisplayCompanyInteraction } = require('../../../interactions/services/formatting.service')
const { getInteractionsForInvestment } = require('../../../interactions/interactions.repo')

async function indexGetHandler (req, res, next) {
  try {
    if (get(res, 'locals.projectData')) {
      const interactionsResponse = await getInteractionsForInvestment(req.session.token, req.params.id)
      const interactions = interactionsResponse.results.map(getDisplayCompanyInteraction)

      res.locals.title.unshift('Interactions')

      return res.render('investment/interaction/index', {
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
