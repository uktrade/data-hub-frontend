const config = require('../../config')
const { authorisedRequest } = require('../../lib/authorised-request')

const Order = {
  getById(req, id) {
    return authorisedRequest(req, `${config.apiRoot}/v3/omis/order/${id}`)
  },

  previewQuote(req, id) {
    return authorisedRequest(req, {
      url: `${config.apiRoot}/v3/omis/order/${id}/quote/preview`,
      method: 'POST',
    })
  },

  getQuote(req, id) {
    return authorisedRequest(req, `${config.apiRoot}/v3/omis/order/${id}/quote`)
  },

  createQuote(req, id) {
    return authorisedRequest(req, {
      url: `${config.apiRoot}/v3/omis/order/${id}/quote`,
      method: 'POST',
    })
  },

  cancelQuote(req, id) {
    return authorisedRequest(req, {
      url: `${config.apiRoot}/v3/omis/order/${id}/quote/cancel`,
      method: 'POST',
    })
  },
}

module.exports = {
  Order,
}
