/* eslint camelcase: 0, prefer-promise-reject-errors: 0 */
const config = require('../../config')
const { authorisedRequest } = require('../../lib/authorised-request')

function getCompanyExport(req, id) {
  return authorisedRequest(req, `${config.apiRoot}/v4/export/${id}`)
}

module.exports = {
  getCompanyExport,
}
