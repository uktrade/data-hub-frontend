const router = require('express').Router()
const { renderDashboard } = require('./controllers')

module.exports = {
  router: router.get('/', renderDashboard),
}
