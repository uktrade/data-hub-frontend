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

module.exports = {
  getDnbHierarchy,
}
