const config = require('../../config')
const { authorisedRequest } = require('../../lib/authorised-request')

function getInvestment(req, investmentId) {
  return authorisedRequest(
    req,
    `${config.apiRoot}/v3/investment/${investmentId}`
  )
}

module.exports = {
  getInvestment,
}
