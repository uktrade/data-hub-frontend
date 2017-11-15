const { get, merge, sumBy } = require('lodash')

const { transformSubscriberToView } = require('../../transformers')

function renderWorkOrder (req, res) {
  const order = res.locals.order
  const assignees = res.locals.assignees
  const subscribers = res.locals.subscribers.map(transformSubscriberToView(get(res.locals, 'user.id')))

  const values = merge({}, order, {
    assignees,
    subscribers,
    contact: res.locals.contact,
    estimatedTimeSum: sumBy(assignees, 'estimated_time'),
  })

  res.render('omis/apps/view/views/work-order', {
    values,
  })
}

function renderQuote (req, res) {
  const orderStatus = get(res.locals, 'order.status')
  const heading = `Quote${orderStatus === 'draft' ? ' preview' : ''}`

  res
    .breadcrumb(heading)
    .render('omis/apps/view/views/quote')
}

function renderPaymentReceipt (req, res) {
  const { id, status } = get(res.locals, 'order')

  if (!['paid', 'complete'].includes(status)) {
    return res.redirect(`/omis/${id}`)
  }

  res
    .breadcrumb('Payment receipt')
    .render('omis/apps/view/views/payment-receipt')
}

module.exports = {
  renderWorkOrder,
  renderQuote,
  renderPaymentReceipt,
}
