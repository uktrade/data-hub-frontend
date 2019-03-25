const { authorisedRequest } = require('../../../../../lib/authorised-request')
const config = require('../../../../../../config')

function getCompanyProfiles (token, companyId) {
  const url = `${config.apiRoot}/v4/large-investor-profile?investor_company_id=${companyId}`
  return authorisedRequest(token, url)
}

function createCompanyProfile (token, body) {
  return authorisedRequest(token, {
    body,
    method: 'POST',
    url: `${config.apiRoot}/v4/large-investor-profile`,
  })
}

module.exports = {
  getCompanyProfiles,
  createCompanyProfile,
}
