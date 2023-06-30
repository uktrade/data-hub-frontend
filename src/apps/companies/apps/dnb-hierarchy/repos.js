const { authorisedRequest } = require('../../../../lib/authorised-request')
const config = require('../../../../config')

function getDnbHierarchy(req, globalUltimateDunsNumber, limit, page = 1) {
  const offset = limit * (page - 1)

  return authorisedRequest(req, {
    url: `${config.apiRoot}/v4/company`,
    qs: {
      limit,
      offset,
      sortby: 'name',
      global_ultimate_duns_number: globalUltimateDunsNumber,
    },
  })
}

async function getRelatedCompaniesCount(req, companyId) {
  return await authorisedRequest(req, {
    url: `${config.apiRoot}/v4/dnb/${companyId}/related-companies/count?include_subsidiary_companies=true`,
  })
}

async function getGlobalUltimate(req, globalUltimateDunsNumber) {
  return await authorisedRequest(req, {
    method: 'POST',
    url: `${config.apiRoot}/v4/search/company`,
    qs: {
      limit: 1,
    },
    body: { duns_number: globalUltimateDunsNumber },
  })
}

module.exports = {
  getDnbHierarchy,
  getGlobalUltimate,
  getRelatedCompaniesCount,
}
