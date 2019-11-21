const { authorisedRequest } = require('../../../../lib/authorised-request')
const config = require('../../../../config')

function getDnbSubsidiaries (token, dunsNumber, limit, page) {
  const parsedPage = parseInt(page, 10) || 1
  const offset = limit * (parsedPage - 1)

  return authorisedRequest(token, {
    url: `${config.apiRoot}/v4/company`,
    qs: {
      limit,
      offset,
      sortby: 'name',
      global_ultimate_duns_number: dunsNumber,
    },
  })
}

module.exports = {
  getDnbSubsidiaries,
}
