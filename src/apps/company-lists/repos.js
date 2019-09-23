const config = require('../../../config')
const { authorisedRequest } = require('../../lib/authorised-request')

function createUserCompanyList (token, id, name) {
  return authorisedRequest(token, {
    method: 'POST',
    url: `${config.apiRoot}/v4/company-list`,
    body: {
      id,
      name,
    },
  })
}

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
  createUserCompanyList,
}
