const config = require('../../../../config')
const { authorisedRequest } = require('../../../../lib/authorised-request')

function fetchActivityFeed(req, body) {
  return authorisedRequest(req, {
    url: `${config.apiRoot}/v4/activity-feed`,
    body,
  })
}

function fetchAventriAttendeeIDs(req, aventriAttendee) {
  const attendeeEmail = aventriAttendee.object['dit:aventri:email']
  return authorisedRequest(req, {
    method: 'GET',
    url: `${config.apiRoot}/v3/contact?email=${attendeeEmail}`,
  })
}

module.exports = {
  fetchActivityFeed,
  fetchAventriAttendeeIDs,
}
