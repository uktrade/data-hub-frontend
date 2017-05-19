const router = require('express').Router()
const winston = require('winston')
const Q = require('q')

const {
  getInvestmentProjectSummary,
  getInvestmentValue,
  getInvestmentRequirements
} = require('../repos/investment.repo')

const localNavItems = [
  { label: 'Project details', slug: 'details' },
  { label: 'Client', url: 'client' },
  { label: 'Project team', url: 'team' },
  { label: 'Interactions', url: 'interactions' },
  { label: 'Documents', url: 'documents' },
  { label: 'Evaluation', url: 'evaluation' },
  { label: 'Audit history', url: 'audit' }
]

function getDetails (req, res, next) {
  Q.spawn(function * () {
    try {
      const project = yield getInvestmentProjectSummary(req.session.token, req.params.id)
      const value = yield getInvestmentValue(req.session.token, req.params.id)
      const requirements = yield getInvestmentRequirements(req.session.token, req.params.id)

      res.render('investment/details', {
        project,
        value,
        requirements,
        localNavItems,
        currentNavItem: 'details'
      })
    } catch (error) {
      winston.error(error)
      next(error)
    }
  })
}

function editDetails (req, res, next) {
  Q.spawn(function * () {
    try {
      const project = yield getInvestmentProjectSummary(req.session.token, req.params.id)

      res.render('investment/details-edit', {
        project,
        localNavItems,
        tab: 'project-details'
      })
    } catch (error) {
      winston.error(error)
      next(error)
    }
  })
}

router.get('/investment/:id', (req, res) => res.redirect(`/investment/${req.params.id}/details`))
router.get('/investment/:id/details', getDetails)
router.get('/investment/:id/details/edit', editDetails)

module.exports = { router, getDetails }
