const { authorisedRequest } = require('../../../../../lib/authorised-request')
const config = require('../../../../../../config')

function getCompanyProfiles (token, companyId) {
  return authorisedRequest(token, `${config.apiRoot}/v4/large-investor-profile?investor_company_id=${companyId}`)
}

module.exports = {
  getCompanyProfiles,
}
