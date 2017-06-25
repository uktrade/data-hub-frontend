const router = require('./router')
const labels = require('./labels')
const repository = require('./interactions.repo')
const controllers = require('./controllers')
const services = require('./services')

module.exports = {
  router,
  labels,
  repository,
  controllers,
  services,
}
