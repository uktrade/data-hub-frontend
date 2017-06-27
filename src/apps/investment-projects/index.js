const router = require('./router')
const labels = require('./labels')
const repository = require('./investment-projects.repo')
const controllers = require('./controllers')
const middleware = require('./middleware')
const services = require('./services')

module.exports = {
  router,
  labels,
  repository,
  controllers,
  middleware,
  services,
}
