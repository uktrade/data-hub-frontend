const { authorisedRequest } = require('../../../../lib/authorised-request')

async function fetchActivityFeed(req, body) {
  return authorisedRequest(req, {
    url: `${req.res.locals.BASE_URL}/api-proxy/v4/activity-feed`,
    body,
  })
}

module.exports = {
  fetchActivityFeed,
}
