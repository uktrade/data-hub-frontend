const router = require('./router')
const urls = require('../../lib/urls')

module.exports = {
  displayName: 'Referrals',
  mountpath: urls.referrals.index.mountPoint,
  router,
}
