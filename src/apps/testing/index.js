const urls = require('../../lib/urls')
const router = require('./router')

module.exports = {
  displayName: 'Testing',
  mountpath: urls.testing.index.mountPoint,
  router,
}
