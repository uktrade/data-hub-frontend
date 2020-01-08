const config = require('../../../../config')
const { authorisedRequest } = require('../../../../lib/authorised-request')

function fetchActivityFeed({ token, body }) {
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v4/activity-feed`,
    body,
  })
}

module.exports = {
  fetchActivityFeed,
}
