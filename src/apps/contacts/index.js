const urls = require('../../lib/urls')
const router = require('./router')
const userFeatures = require('../../middleware/user-features')

module.exports = {
  displayName: 'Contacts',
  mountpath: urls.contacts.index.mountPoint,
  // router,
  router: router.get(userFeatures('aventri-activities-contacts-user')),
}
