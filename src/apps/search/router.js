const router = require('express').Router()

const {
  searchAction,
  viewCompanyResult,
  renderInvestmentProjects,
} = require('./controllers')

router.get('/search/investment-projects', renderInvestmentProjects)
router.get('/search/:searchPath?', searchAction)

router.get('/viewcompanyresult/:id', viewCompanyResult) // TODO is this in the right controller

module.exports = router
