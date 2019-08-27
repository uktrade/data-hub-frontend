const { authorisedRequest } = require('../../lib/authorised-request')
const config = require('../../../config')

function fetchHomepageData (token) {
  return authorisedRequest(token, `${config.apiRoot}/dashboard/homepage/`)
}

function fetchCompanyList (token) {
  return authorisedRequest(token, {
    method: 'GET',
    url: `${config.apiRoot}/v4/user/company-list`,
  })
}

module.exports = {
  fetchHomepageData,
  fetchCompanyList,
}
