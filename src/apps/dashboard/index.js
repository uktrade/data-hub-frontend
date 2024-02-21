const router = require('express').Router()

const urls = require('../../lib/urls')
const { renderDashboard } = require('./controllers')

module.exports = {
  router: router.get(
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
  ),
}
