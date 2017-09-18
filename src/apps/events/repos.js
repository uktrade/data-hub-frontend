const config = require('../../../config')
const authorisedRequest = require('../../lib/authorised-request')

function createEvent (token, body) {
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v3/event`,
    method: 'POST',
    body,
  })
}

module.exports = {
  createEvent,
}
