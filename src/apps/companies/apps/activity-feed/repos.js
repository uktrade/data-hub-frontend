const { get } = require('lodash')

const config = require('../../../../config')
const { authorisedRequest } = require('../../../../lib/authorised-request')

// istanbul ignore next: Covered by functional tests
async function fetchUserFeatureFlags(req) {
  // istanbul ignore next: Covered by functional tests
  const user = await authorisedRequest(req, `${config.apiRoot}/whoami/`)
  return get(user, 'active_features', [])
}
module.exports = {
  fetchUserFeatureFlags,
}
