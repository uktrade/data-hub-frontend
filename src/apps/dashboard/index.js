const router = require('express').Router()
const urls = require('../../lib/urls')
const { renderDashboard } = require('./controllers')
const spaBasePath = require('../../middleware/spa-base-path')

module.exports = {
  router: router.get(
    // These paths are handled by react-router
    [
      urls.dashboard(),
      urls.companyLists.index(),
      urls.investments.dashboard.projects(),
      urls.companies.referrals.list(),
      urls.exportPipeline.index(),
    ],
    spaBasePath(urls.dashboard.route),
    renderDashboard
  ),
}
