const config = require('../../../config')
const authorisedRequest = require('../../lib/authorised-request')

function getCompaniesHouse (token, id) {
  return authorisedRequest(token, `${config.apiRoot}/v3/ch-company/${id}`)
}

module.exports = {
  getCompaniesHouse,
}
