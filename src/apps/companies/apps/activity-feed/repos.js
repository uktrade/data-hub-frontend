const config = require('../../../../config')
const { authorisedRequest } = require('../../../../lib/authorised-request')

function fetchActivityFeed(req, body) {
  return authorisedRequest(req, {
    url: `${config.apiRoot}/v4/activity-feed`,
    body,
  })
}

module.exports = {
  fetchActivityFeed,
}
