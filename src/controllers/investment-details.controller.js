const router = require('express').Router()
const Q = require('q')

const {
  getInvestmentProjectSummary,
  getInvestmentValue,
  getInvestmentRequirements
} = require('../repos/investment.repo')

const localNavItems = [
  { label: 'Project details', slug: 'details' },
  { label: 'Client', slug: 'client' },
  { label: 'Project team', slug: 'team' },
  { label: 'Interactions', slug: 'interactions' },
  { label: 'Documents', slug: 'documents' },
  { label: 'Evaluation', slug: 'evaluation' },
  { label: 'Audit history', slug: 'audit' }
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
      next(error)
    }
  })
}

function redirectToDetails (req, res) {
  return res.redirect(`/investment/${req.params.id}/details`)
}

router.get('/investment/:id', redirectToDetails)
router.get('/investment/:id/details', getDetails)
router.get('/investment/:id/details/edit', editDetails)

module.exports = { router, getDetails }
