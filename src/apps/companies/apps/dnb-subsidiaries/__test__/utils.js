const nock = require('nock')
const config = require('../../../../../config')

function mockDnbSubsidiariesEndpoint ({
  globalUltimateSunsNumber,
  responseBody,
  responseCode = 200,
  offset = 0,
}) {
  nock(config.apiRoot)
    .get(`/v4/company?limit=10&offset=${offset}&sortby=name&global_ultimate_duns_number=${globalUltimateSunsNumber}`)
    .reply(responseCode, responseBody)
}

module.exports = {
  mockDnbSubsidiariesEndpoint,
}
