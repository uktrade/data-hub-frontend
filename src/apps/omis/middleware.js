const { assign } = require('lodash')

const { Order } = require('./models')

async function setOrder(req, res, next, orderId) {
  try {
    const order = await Order.getById(req, orderId)
    const activeOrder = !['cancelled', 'complete'].includes(order.status)

    res.locals.order = assign({}, order, {
      canEditOrder: order.status === 'draft',
      canEditAdvisers: activeOrder,
      canEditInvoiceDetails: activeOrder,
      canEditContactDetails: activeOrder,
    })

    const currencyFields = [
      'net_cost',
      'discount_value',
      'subtotal_cost',
      'vat_cost',
      'total_cost',
    ]
    currencyFields.forEach((field) => {
      res.locals.order[field] = parseFloat(res.locals.order[field]) / 100
    })

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  setOrder,
}
