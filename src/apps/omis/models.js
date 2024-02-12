const config = require('../../config')
const { authorisedRequest } = require('../../lib/authorised-request')

const Order = {
  getById(req, id) {
    return authorisedRequest(req, `${config.apiRoot}/v3/omis/order/${id}`)
  },
}

module.exports = {
  Order,
}
