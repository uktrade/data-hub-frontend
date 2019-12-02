const { authorisedRequest } = require('../../../../lib/authorised-request')
const config = require('../../../../config')

function getDnbHierarchy (token, globalUltimateDunsNumber, limit, page = 1) {
  const offset = limit * (page - 1)

  return authorisedRequest(token, {
    url: `${config.apiRoot}/v4/company`,
    qs: {
      limit,
      offset,
      sortby: 'name',
      global_ultimate_duns_number: globalUltimateDunsNumber,
    },
  })
}

module.exports = {
  getDnbHierarchy,
}
