const { assign, get } = require('lodash')

const { getDitCompany } = require('../companies/repos')
const { setHomeBreadcrumb } = require('../middleware')
const { Order } = require('./models')

async function setCompany (req, res, next, companyId) {
  try {
    res.locals.company = await getDitCompany(req.session.token, companyId)
    next()
  } catch (error) {
    next(error)
  }
}

async function setOrder (req, res, next, orderId) {
  try {
    const order = await Order.getById(req.session.token, orderId)

    res.locals.order = assign({}, order, {
      canEditOrder: order.status === 'draft',
      canEditAdvisers: !['cancelled', 'complete'].includes(order.status),
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

function setOrderBreadcrumb (req, res, next) {
  const reference = get(res.locals, 'order.reference')

  return setHomeBreadcrumb(reference)(req, res, next)
}

module.exports = {
  setCompany,
  setOrder,
  setOrderBreadcrumb,
}
