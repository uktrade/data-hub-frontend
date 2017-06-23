const router = require('./router')
const dashboardController = require('./dashboard.controller')
const dashboardService = require('./dashboard.service')

module.exports = {
  router,
  controllers: {
    dashboard: dashboardController,
  },
  services: {
    dashboard: dashboardService,
  },
}
