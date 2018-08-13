const config = require('../../../config')
const authorisedRequest = require('../../lib/authorised-request')

function getEvidenceForInvestment (token, investmentId) {
  // return authorisedRequest(token, `${config.apiRoot}/v3/investment/${investmentId}/evidence`)

  console.log('~~~~~~~~~~~~~~')

  return {
    apples: 'pears',
  }
}

module.exports = {
  getEvidenceForInvestment,
}
