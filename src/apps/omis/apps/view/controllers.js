const { merge, sumBy } = require('lodash')

const { Order } = require('../../models')
const logger = require('../../../../../config/logger')

async function renderWorkOrder (req, res) {
  const order = res.locals.order
  let values

  try {
    const subscribers = await Order.getSubscribers(req.session.token, order.id)
    const assignees = await Order.getAssignees(req.session.token, order.id)

    values = merge({}, order, {
      subscribers,
      assignees,
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
  res
    .breadcrumb('Quote')
    .render('omis/apps/view/views/quote')
}

module.exports = {
  renderWorkOrder,
  renderQuote,
}
