const config = require('../../config')
const { authorisedRequest } = require('../../lib/authorised-request')

function getInvestment(req, investmentId) {
  return authorisedRequest(
    req,
    `${config.apiRoot}/v3/investment/${investmentId}`
  )
}

function getInvestmentProjectAuditLog(req, investmentId, page = 1) {
  const limit = 10
  const offset = limit * (page - 1)
  return authorisedRequest(req, {
    url: `${config.apiRoot}/v3/investment/${investmentId}/audit`,
    qs: { limit, offset },
  })
}

module.exports = {
  getInvestment,
  getInvestmentProjectAuditLog,
}
