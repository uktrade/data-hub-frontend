const { assign, get, set } = require('lodash')

const { getDitCompany } = require('../companies/repos')
const { setHomeBreadcrumb } = require('../middleware')
const { Order } = require('./models')
const labels = require('./locales/en/default')

async function setCompany(req, res, next, companyId) {
  try {
    res.locals.company = await getDitCompany(req, companyId)
    next()
  } catch (error) {
    next(error)
  }
}

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

function setOrderBreadcrumb(req, res, next) {
  const reference = get(res.locals, 'order.reference')

  return setHomeBreadcrumb(reference)(req, res, next)
}

/*
In order to remove the i18n-future dependency this
function has been introduced to replace code which was
calling the translation library. Translations are not
required at this stage.
*/
function translate(req, res, next) {
  set(res.locals, 'translate', (key) => get(labels, key))
  next()
}

module.exports = {
  setCompany,
  setOrder,
  setOrderBreadcrumb,
  translate,
}
