const { authorisedRequest } = require('../../../../../lib/authorised-request')
const config = require('../../../../../config')

function getCompanyProfiles(req, companyId) {
  const url = `${config.apiRoot}/v4/large-investor-profile?investor_company_id=${companyId}`
  return authorisedRequest(req, url)
}

function createCompanyProfile(req, body) {
  return authorisedRequest(req, {
    body,
    method: 'POST',
    url: `${config.apiRoot}/v4/large-investor-profile`,
  })
}

function updateCompanyProfile(req, body, profileId) {
  return authorisedRequest(req, {
    body,
    method: 'PATCH',
    url: `${config.apiRoot}/v4/large-investor-profile/${profileId}`,
  })
}

module.exports = {
  getCompanyProfiles,
  createCompanyProfile,
  updateCompanyProfile,
}
