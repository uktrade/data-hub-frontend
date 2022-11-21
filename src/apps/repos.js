const config = require('../config')
const { authorisedRequest } = require('../lib/authorised-request')

function getNotificationCount(req) {
  return authorisedRequest(req, `${config.apiRoot}/v4/reminder/summary`)
}

module.exports = {
  getNotificationCount,
}
