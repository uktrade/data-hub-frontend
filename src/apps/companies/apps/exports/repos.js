const config = require('../../../../config')
const { authorisedRequest } = require('../../../../lib/authorised-request')

module.exports = {
  getFullExportHistory: (token, companyId) => {
    return authorisedRequest(token, {
      url: `${config.apiRoot}/v4/search/export-country-history`,
      method: 'POST',
      body: {
        company: companyId,
      },
    })
  },
}
