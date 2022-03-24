const urls = require('../../lib/urls')
const router = require('./router')

module.exports = {
  displayName: 'Contacts',
  mountpath: urls.contacts.index.mountPoint,
  router,
}
