const nock = require('nock')
const config = require('../../../../../config')

function mockGetDnbHierarchy ({
  globalUltimateDunsNumber,
  responseBody,
  responseCode = 200,
  offset = 0,
  limit = 10,
}) {
  nock(config.apiRoot)
    .get(`/v4/company?limit=${limit}&offset=${offset}&sortby=name&global_ultimate_duns_number=${globalUltimateDunsNumber}`)
    .reply(responseCode, responseBody)
}

module.exports = {
  mockGetDnbHierarchy,
}
