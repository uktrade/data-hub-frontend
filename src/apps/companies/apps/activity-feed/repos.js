const config = require('../../../../config')
const { authorisedRequest } = require('../../../../lib/authorised-request')

function fetchActivityFeed(req, body) {
  return authorisedRequest(req, {
    url: `${config.apiRoot}/v4/activity-feed`,
    body,
  })
}

// istanbul ignore next: Covered by functional tests
function fetchMatchingDataHubContact(req, attendeeEmail) {
  // istanbul ignore next: Covered by functional tests
  return authorisedRequest(req, {
    method: 'GET',
    url: `${config.apiRoot}/v3/contact?email=${attendeeEmail}`,
  })
}

module.exports = {
  fetchActivityFeed,
  fetchMatchingDataHubContact,
}
