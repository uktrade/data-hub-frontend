const { get, merge, sumBy } = require('lodash')

const { transformSubscriberToView } = require('../../transformers')

function renderWorkOrder(req, res, next) {
  const order = res.locals.order
  const assignees = res.locals.assignees
  const subscribers = get(res.locals, 'subscribers', []).map(
    transformSubscriberToView(get(res.locals, 'user.id'))
  )
  try {
    const values = merge({}, order, {
      assignees,
      subscribers,
      contact: res.locals.contact,
      quote: res.locals.quote,
      estimatedTimeSum: sumBy(assignees, 'estimated_time'),
    })

    res.render('omis/apps/view/views/work-order', {
      values,
    })
  } catch (e) {
    next(e)
  }
}

function renderQuote(req, res) {
  const orderStatus = get(res.locals, 'order.status')
  const heading = `Quote${orderStatus === 'draft' ? ' preview' : ''}`

  res.breadcrumb(heading).render('omis/apps/view/views/quote')
}

function renderPaymentReceipt(req, res) {
  const { id } = get(res.locals, 'order')
  const { payments } = res.locals

  if (!payments || payments.length === 0) {
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
