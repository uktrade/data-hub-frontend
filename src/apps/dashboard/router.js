const router = require('express').Router()

const urls = require('../../lib/urls')
const { renderDashboard } = require('./controllers')

const interactionsRouter = require('../interactions/router.sub-app')
const { setCompanyDetails } = require('./middleware/interactions')
const { getCompanyExportParam } = require('./middleware/params')
const { setHome } = require('../../middleware/breadcrumbs')

router.param('exportId', getCompanyExportParam)

router.use(
  `${urls.exportPipeline.index.mountPoint}${urls.exportPipeline.interactions.index.route}`,
  setHome({ href: '/export' }),
  setCompanyDetails,
  interactionsRouter
)

router.get(
  // These paths are handled by react-router
  [
    urls.dashboard.index(),
    urls.companyLists.index(),
    urls.dashboard.investmentProjects(),
    urls.companies.referrals.list(),
    urls.exportPipeline.index(),
    urls.dashboard.myTasks(),
  ],
  renderDashboard
)

module.exports = router
