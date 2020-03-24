const { authorisedRequest } = require('../../../../lib/authorised-request')
const config = require('../../../../config/index')

function getReferral(token, referralId) {
  return authorisedRequest(
    token,
    `${config.apiRoot}/v4/company-referral/${referralId}`
  )
}

module.exports = { getReferral }
