const { authorisedRequest } = require('../../../../lib/authorised-request')
const config = require('../../../../config')

function excludeGlobalUltimate (globalUltimateDunsNumber, response) {
  return {
    count: response.count - 1,
    results: response.results.filter(c => c.duns_number !== globalUltimateDunsNumber + ''),
  }
}

async function getDnbSubsidiaries (token, dunsNumber, limit, page) {
  const parsedPage = parseInt(page, 10) || 1
  const offset = limit * (parsedPage - 1)

  const response = await authorisedRequest(token, {
    url: `${config.apiRoot}/v4/company`,
    qs: {
      limit,
      offset,
      sortby: 'name',
      global_ultimate_duns_number: dunsNumber,
    },
  })

  return excludeGlobalUltimate(dunsNumber, response)
}

module.exports = {
  getDnbSubsidiaries,
}
