const { get } = require('lodash')

const config = require('../../../../config')
const { authorisedRequest } = require('../../../../lib/authorised-request')

async function fetchActivityFeed(req, body) {
  return await authorisedRequest(req, {
    url: `${config.apiRoot}/v4/activity-feed`,
    body,
  })
}

// istanbul ignore next: Covered by functional tests
async function fetchUserFeatureFlags(req) {
  // istanbul ignore next: Covered by functional tests
  const user = await authorisedRequest(req, `${config.apiRoot}/whoami/`)
  return get(user, 'active_features', [])
}
module.exports = {
  fetchActivityFeed,
  fetchUserFeatureFlags,
}
