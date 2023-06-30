const nock = require('nock')
const config = require('../../../../../config')

function mockGetDnbHierarchy({
  globalUltimateDunsNumber,
  responseBody,
  companyId,
  relatedCompaniesCount,
  responseCode = 200,
  offset = 0,
  limit = 10,
}) {
  nock(config.apiRoot)
    .get(
      `/v4/company?limit=${limit}&offset=${offset}&sortby=name&global_ultimate_duns_number=${globalUltimateDunsNumber}`
    )
    .reply(responseCode, responseBody)

  nock(config.apiRoot)
    .get(
      `/v4/dnb/${companyId}/related-companies/count?include_subsidiary_companies=true`
    )
    .reply(responseCode, relatedCompaniesCount)

  nock(config.apiRoot)
    .post(`/v4/search/company`)
    .query(true)
    .reply(responseCode, responseBody)
}

module.exports = {
  mockGetDnbHierarchy,
}
