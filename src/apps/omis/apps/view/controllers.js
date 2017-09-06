const { sumBy } = require('lodash')

function renderWorkOrder (req, res) {
  const order = res.locals.order

  const values = Object.assign({}, order, {
    estimatedTimeSum: sumBy(order.assignees, 'estimated_time'),
  })

  res
    .render('omis/apps/view/views/work-order', {
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
