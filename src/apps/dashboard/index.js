const router = require('express').Router()
const urls = require('../../lib/urls')
const { renderDashboard } = require('./controllers')
const spaBasePath = require('../../middleware/spa-base-path')
const layoutTesting = require('../../middleware/layout-testing')

module.exports = {
  router: router.get(
    // These paths are handled by react-router
    [
      urls.dashboard.mountPoint,
      urls.companies.referrals.list.mountPoint,
      urls.pipeline.index.mountPoint,
      urls.pipeline.active.mountPoint,
      urls.pipeline.won.mountPoint,
    ],
    spaBasePath(urls.dashboard.route),
    layoutTesting('dashboard'),
    renderDashboard
  ),
}
