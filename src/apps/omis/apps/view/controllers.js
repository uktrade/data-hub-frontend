const { get, merge, sumBy } = require('lodash')

const { Order } = require('../../models')
const logger = require('../../../../../config/logger')

async function renderWorkOrder (req, res) {
  const order = res.locals.order
  let values
  const assignees = res.locals.assignees

  try {
    const subscribers = await Order.getSubscribers(req.session.token, order.id)

    values = merge({}, order, {
      subscribers,
      assignees,
      contact: res.locals.contact,
      estimatedTimeSum: sumBy(assignees, 'estimated_time'),
    })
  } catch (e) {
    logger.error(e)
  }

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
