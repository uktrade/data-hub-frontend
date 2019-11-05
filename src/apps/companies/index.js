const urls = require('../../lib/urls')
const router = require('./router')

module.exports = {
  displayName: 'Companies',
  mountpath: urls.companies.index.mountPoint,
  router,
}
