const router = require('express').Router()

const dashboardController = require('./dashboard.controller')

router.get('/', dashboardController.getHandler)

module.exports = {
  router,
}
