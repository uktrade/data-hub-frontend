const router = require('express').Router()
const urls = require('../../lib/urls')
const { renderDashboard } = require('./controllers')

module.exports = {
  router: router.get(urls.dashboard.route, renderDashboard),
}
