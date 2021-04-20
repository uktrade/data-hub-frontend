const router = require('express').Router()
const urls = require('../../lib/urls')
const { renderDashboard } = require('./controllers')
const spaBasePath = require('../../middleware/spa-base-path')
const featureTesting = require('../../middleware/feature-testing')

module.exports = {
  router: router.get(
    // These paths are handled by react-router
    [
      urls.dashboard(),
      urls.companyLists.index(),
      urls.companies.referrals.list(),
      urls.pipeline.index(),
      urls.pipeline.active(),
      urls.pipeline.won(),
    ],
    spaBasePath(urls.dashboard.route),
    featureTesting('personalised-dashboard'),
    renderDashboard
  ),
}
