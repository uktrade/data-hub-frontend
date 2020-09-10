const { authorisedRequest } = require('../../../../lib/authorised-request')
const config = require('../../../../config/index')

function getReferral(req, referralId) {
  return authorisedRequest(
    req,
    `${config.apiRoot}/v4/company-referral/${referralId}`
  )
}

module.exports = { getReferral }
