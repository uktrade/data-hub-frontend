const router = require('express').Router()
const urls = require('../../lib/urls')
const { renderDashboard } = require('./controllers')
const spaBasePath = require('../../middleware/spa-base-path')
const userFeatures = require('../../middleware/user-features')

module.exports = {
  router: router.get(
    // These paths are handled by react-router
    [
      urls.dashboard(),
      urls.companyLists.index(),
      urls.companies.referrals.list(),
      urls.exportPipeline.index(),
    ],
    spaBasePath(urls.dashboard.route),
    userFeatures('personalised-dashboard'),
    renderDashboard
  ),
}
