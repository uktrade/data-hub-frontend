const router = require('express').Router()
const { get } = require('lodash')

const { getDisplayCompanyInteraction } = require('../../../services/interaction-formatting.service')
const { getInteractionsForInvestment } = require('../../../repos/interaction.repo')
const { getProjectDetails } = require('../shared.middleware')

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

router.param('id', getProjectDetails)

router.get('/:id/interactions', indexGetHandler)

module.exports = {
  router,
  indexGetHandler,
}
