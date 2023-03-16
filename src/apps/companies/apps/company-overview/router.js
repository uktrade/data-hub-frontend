const router = require('express').Router()
const urls = require('../../../../lib/urls')

const { renderOverview } = require('./controllers')
const { setCompanyInvestmentProjects } = require('./controllers')

router.get(urls.companies.overview.index.route, renderOverview)
router.get(
  urls.companies.investments.companyInvestmentProjects.route,
  setCompanyInvestmentProjects
)

module.exports = router
