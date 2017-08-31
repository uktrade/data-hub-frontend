const { sumBy } = require('lodash')

function renderWorkOrder (req, res) {
  const order = res.locals.order

  const values = Object.assign({}, order, {
    estimatedTimeSum: sumBy(order.assignees, 'estimated_time'),
  })

  res
    .breadcrumb('Work order')
    .render('omis/apps/view/views/work-order', {
      values,
    })
}

module.exports = {
  renderWorkOrder,
}
