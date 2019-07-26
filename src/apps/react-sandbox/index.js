const router = require('express').Router()
const { renderReactSandbox } = require('./controller')
const { isDev } = require('../../../config')

module.exports = {
  router: isDev && router.get('/react-sandbox', renderReactSandbox),
}
