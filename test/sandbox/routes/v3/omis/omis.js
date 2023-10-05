import cancelledOrderJson from '../../../fixtures/v3/omis/cancelled-order.json' assert { type: 'json' }
import draftOrderJson from '../../../fixtures/v3/omis/draft-order.json' assert { type: 'json' }
import paidOrderJson from '../../../fixtures/v3/omis/paid-order.json' assert { type: 'json' }
import assigneesJson from '../../../fixtures/v3/omis/assignees.json' assert { type: 'json' }
import invoiceJson from '../../../fixtures/v3/omis/invoice.json' assert { type: 'json' }
import paymentsJson from '../../../fixtures/v3/omis/payments.json' assert { type: 'json' }
import quoteJson from '../../../fixtures/v3/omis/quote.json' assert { type: 'json' }
import quoteAcceptedJson from '../../../fixtures/v3/omis/quote-accepted.json' assert { type: 'json' }
import subscribersJson from '../../../fixtures/v3/omis/subscribers.json' assert { type: 'json' }
import quoteAwaitOrderJson from '../../../fixtures/v3/omis/quote-awaiting-order.json' assert { type: 'json' }
import emptyOrderJson from '../../../fixtures/v3/omis/empty-order.json' assert { type: 'json' }

export const assignees = function (req, res) {
  res.json(assigneesJson)
}

export const invoice = function (req, res) {
  res.json(invoiceJson)
}

export const getOrderById = function (req, res) {
  const orders = {
    [cancelledOrderJson.id]: cancelledOrderJson,
    [paidOrderJson.id]: paidOrderJson,
    [draftOrderJson.id]: draftOrderJson,
    [quoteAwaitOrderJson.id]: quoteAwaitOrderJson,
    [quoteAcceptedJson.id]: quoteAcceptedJson,
    [emptyOrderJson.id]: emptyOrderJson,
  }

  res.json(orders[req.params.id] || paidOrderJson)
}

export const payments = function (req, res) {
  res.json(req.params.id === draftOrderJson.id ? [] : paymentsJson)
}

export const createPayments = function (req, res) {
  res.json({})
}

export const quote = function (req, res) {
  res.json(quoteJson)
}

export const subscriberList = function (req, res) {
  res.json(subscribersJson)
}

export const editQuoteDetail = function (req, res) {
  res.json({})
}
