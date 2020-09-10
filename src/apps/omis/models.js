const config = require('../../config')
const { authorisedRequest } = require('../../lib/authorised-request')

const Order = {
  save(req, data) {
    return authorisedRequest(req, {
      url: `${config.apiRoot}/v3/omis/order`,
      method: 'POST',
      body: data,
    })
  },

  update(req, id, data) {
    return authorisedRequest(req, {
      url: `${config.apiRoot}/v3/omis/order/${id}`,
      method: 'PATCH',
      body: data,
    })
  },

  saveSubscribers(req, id, body) {
    return authorisedRequest(req, {
      url: `${config.apiRoot}/v3/omis/order/${id}/subscriber-list`,
      method: 'PUT',
      body,
    })
  },

  getAssignees(req, id) {
    return authorisedRequest(
      req,
      `${config.apiRoot}/v3/omis/order/${id}/assignee`
    )
  },

  saveAssignees(req, id, body) {
    return authorisedRequest(req, {
      url: `${config.apiRoot}/v3/omis/order/${id}/assignee`,
      method: 'PATCH',
      body,
    })
  },

  forceSaveAssignees(req, id, body) {
    return authorisedRequest(req, {
      url: `${config.apiRoot}/v3/omis/order/${id}/assignee?force-delete=1`,
      method: 'PATCH',
      body,
    })
  },

  getSubscribers(req, id) {
    return authorisedRequest(
      req,
      `${config.apiRoot}/v3/omis/order/${id}/subscriber-list`
    )
  },

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

  getInvoice(req, id) {
    return authorisedRequest(
      req,
      `${config.apiRoot}/v3/omis/order/${id}/invoice`
    )
  },

  getPayments(req, id) {
    return authorisedRequest(
      req,
      `${config.apiRoot}/v3/omis/order/${id}/payment`
    )
  },

  savePayments(req, id, body) {
    return authorisedRequest(req, {
      url: `${config.apiRoot}/v3/omis/order/${id}/payment`,
      method: 'POST',
      body,
    })
  },

  complete(req, id, body) {
    return authorisedRequest(req, {
      url: `${config.apiRoot}/v3/omis/order/${id}/complete`,
      method: 'POST',
      body,
    })
  },

  cancel(req, id, body) {
    return authorisedRequest(req, {
      url: `${config.apiRoot}/v3/omis/order/${id}/cancel`,
      method: 'POST',
      body,
    })
  },
}

module.exports = {
  Order,
}
