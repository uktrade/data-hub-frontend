const urls = require('../../lib/urls')
const router = require('./router')

module.exports = {
  displayName: 'Reminders',
  mountpath: urls.reminders.index(),
  router,
}
