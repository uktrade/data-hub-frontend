const router = require('express').Router()
const urls = require('../../lib/urls')
const { renderDashboard } = require('./controllers')
const spaBasePath = require('../../middleware/spa-base-path')

module.exports = {
  router: router.get(
    // These two paths are handled by react-router
    [urls.dashboard.route, '/my-referrals'],
    spaBasePath(urls.dashboard.route),
    renderDashboard
  ),
}
