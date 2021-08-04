const cancelledOrder = require('../../../fixtures/v3/omis/cancelled-order.json')
const draftOrder = require('../../../fixtures/v3/omis/draft-order.json')
const paidOrder = require('../../../fixtures/v3/omis/paid-order.json')
const assignees = require('../../../fixtures/v3/omis/assignees.json')
const invoice = require('../../../fixtures/v3/omis/invoice.json')
const payments = require('../../../fixtures/v3/omis/payments.json')
const quote = require('../../../fixtures/v3/omis/quote.json')
const quoteAccepted = require('../../../fixtures/v3/omis/quote-accepted.json')
const subscribers = require('../../../fixtures/v3/omis/subscribers.json')
const quoteAwaitOrder = require('../../../fixtures/v3/omis/quote-awaiting-order.json')

exports.assignees = function (req, res) {
  res.json(assignees)
}

exports.invoice = function (req, res) {
  res.json(invoice)
}

exports.getOrderById = function (req, res) {
  const orders = {
    [cancelledOrder.id]: cancelledOrder,
    [paidOrder.id]: paidOrder,
    [draftOrder.id]: draftOrder,
    [quoteAwaitOrder.id]: quoteAwaitOrder,
    [quoteAccepted.id]: quoteAccepted,
  }

  res.json(orders[req.params.id] || paidOrder)
}

exports.payments = function (req, res) {
  res.json(req.params.id === draftOrder.id ? [] : payments)
}

exports.createPayments = function (req, res) {
  res.json({})
}

exports.quote = function (req, res) {
  res.json(quote)
}

exports.subscriberList = function (req, res) {
  res.json(subscribers)
}

exports.editQuoteDetail = function (req, res) {
  res.json({})
}
