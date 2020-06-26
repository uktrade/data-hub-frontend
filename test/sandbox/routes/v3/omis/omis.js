var cancelledOrder = require('../../../fixtures/v3/omis/cancelled-order.json')
var draftOrder = require('../../../fixtures/v3/omis/draft-order.json')
var paidOrder = require('../../../fixtures/v3/omis/paid-order.json')
var assignees = require('../../../fixtures/v3/omis/assignees.json')
var invoice = require('../../../fixtures/v3/omis/invoice.json')
var payments = require('../../../fixtures/v3/omis/payments.json')
var subscribers = require('../../../fixtures/v3/omis/subscribers.json')

exports.assignees = function(req, res) {
  res.json(assignees)
}

exports.invoice = function(req, res) {
  res.json(invoice)
}

exports.getOrderById = function(req, res) {
  var orders = {
    [cancelledOrder.id]: cancelledOrder,
    [paidOrder.id]: paidOrder,
    [draftOrder.id]: draftOrder,
  }

  res.json(orders[req.params.id] || paidOrder)
}

exports.payments = function(req, res) {
  res.json(req.params.id === draftOrder.id ? [] : payments)
}

exports.subscriberList = function(req, res) {
  res.json(subscribers)
}
