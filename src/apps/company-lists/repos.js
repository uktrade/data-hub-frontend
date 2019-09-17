const config = require('../../../config')
const { authorisedRequest } = require('../../lib/authorised-request')

async function getCompanyList (token, id) {
  return authorisedRequest(token, `${config.apiRoot}/v4/company-list/${id}`)
}

async function deleteCompanyList (token, id) {
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v4/company-list/${id}`,
    method: 'DELETE',
  })
}

module.exports = {
  deleteCompanyList,
  getCompanyList,
}
