const router = require('express').Router()
const Q = require('q')
const { get } = require('lodash')

const { getDisplayCompanyInteraction } = require('../../../services/interaction-formatting.service')
const { getInteractionsForInvestment } = require('../../../repos/interaction.repo')
const { getProjectDetails } = require('../shared.middleware')

function getInvestmentInteractions (req, res, next) {
  Q.spawn(function * () {
    try {
      if (get(res, 'locals.projectData')) {
        const interactionsResponse = yield getInteractionsForInvestment(req.session.token, req.params.id)
        const interactions = interactionsResponse.results.map(getDisplayCompanyInteraction)

        return res.render('investment/interactions/index', {
          currentNavItem: 'interactions',
          interactions: interactions,
        })
      }
      next()
    } catch (error) {
      next(error)
    }
  })
}

router.param('id', getProjectDetails)
router.get('/:id/interactions', getInvestmentInteractions)

module.exports = {
  router,
  getInvestmentInteractions,
}
