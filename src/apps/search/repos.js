const config = require('../../config')
const { authorisedRequest } = require('../../lib/authorised-request')

module.exports = {
  fetchFullExportHistory: (token, limit, page = 1, companyId) => {
    const offset = limit * (page - 1)
    return authorisedRequest(token, {
      url: `${config.apiRoot}/v4/search/export-country-history`,
      method: 'POST',
      qs: {
        limit,
        offset,
      },
      body: {
        company: `${companyId}`,
      },
    })
  },
}
