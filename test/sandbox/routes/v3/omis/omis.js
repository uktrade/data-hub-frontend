import cancelledOrder from '../../../fixtures/v3/omis/cancelled-order.json' with { type: 'json' }
import draftOrder from '../../../fixtures/v3/omis/draft-order.json' with { type: 'json' }
import paidOrder from '../../../fixtures/v3/omis/paid-order.json' with { type: 'json' }
import assignees from '../../../fixtures/v3/omis/assignees.json' with { type: 'json' }
import invoice from '../../../fixtures/v3/omis/invoice.json' with { type: 'json' }
import payments from '../../../fixtures/v3/omis/payments.json' with { type: 'json' }
import quote from '../../../fixtures/v3/omis/quote.json' with { type: 'json' }
import quotePreview from '../../../fixtures/v3/omis/quote-preview.json' with { type: 'json' }
import quoteAccepted from '../../../fixtures/v3/omis/quote-accepted.json' with { type: 'json' }
import subscribers from '../../../fixtures/v3/omis/subscribers.json' with { type: 'json' }
import quoteAwaitOrder from '../../../fixtures/v3/omis/quote-awaiting-order.json' with { type: 'json' }
import emptyOrder from '../../../fixtures/v3/omis/empty-order.json' with { type: 'json' }
import quoteNotAccepted from '../../../fixtures/v3/omis/quote-not-accepted.json' with { type: 'json' }
import quoteCancelled from '../../../fixtures/v3/omis/quote-cancelled.json' with { type: 'json' }

export const getAssignees = function (req, res) {
  res.json(assignees)
}

export const getInvoice = function (req, res) {
  res.json(invoice)
}

export const getOrderById = function (req, res) {
  const orders = {
    [cancelledOrder.id]: cancelledOrder,
    [paidOrder.id]: paidOrder,
    [draftOrder.id]: draftOrder,
    [quoteAwaitOrder.id]: quoteAwaitOrder,
    [quoteAccepted.id]: quoteAccepted,
    [emptyOrder.id]: emptyOrder,
  }

  res.json(orders[req.params.id] || paidOrder)
}

export const getPayments = function (req, res) {
  res.json(req.params.id === draftOrder.id ? [] : payments)
}

export const createPayments = function (req, res) {
  res.json({})
}

export const getQuote = function (req, res) {
  if (req.params.id === quoteAwaitOrder.id) {
    return res.json(quoteNotAccepted)
  }
  if (req.params.id === cancelledOrder.id) {
    return res.json(quoteCancelled)
  }
  return res.json(quote)
}

export const createQuote = function (req, res) {
  res.sendStatus(200)
}

export const cancelQuote = function (req, res) {
  res.sendStatus(200)
}

export const getQuotePreview = function (req, res) {
  res.json(quotePreview)
}

export const subscriberList = function (req, res) {
  res.json(subscribers)
}

export const editQuoteDetail = function (req, res) {
  res.json({})
}
