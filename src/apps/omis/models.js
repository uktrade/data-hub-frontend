const config = require('../../../config')
const authorisedRequest = require('../../lib/authorised-request')

const Order = {
  save (token, data) {
    return authorisedRequest(token, {
      url: `${config.apiRoot}/v3/omis/order`,
      method: 'POST',
      body: data,
    })
  },

  update (token, id, data) {
    return authorisedRequest(token, {
      url: `${config.apiRoot}/v3/omis/order/${id}`,
      method: 'PATCH',
      body: data,
    })
  },

  getById (token, id) {
    return authorisedRequest(token, `${config.apiRoot}/v3/omis/order/${id}`)
  },
}

module.exports = {
  Order,
}
