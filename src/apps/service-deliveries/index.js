const router = require('./router')
const labels = require('./labels')
const repository = require('./service-deliveries.repo')
const serviceDeliveriesController = require('./service-deliveries.controller')
const services = require('./services')

module.exports = {
  router,
  labels,
  repository,
  controllers: {
    serviceDeliveries: serviceDeliveriesController,
  },
  services,
}
