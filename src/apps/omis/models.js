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
}

module.exports = {
  Order,
}
