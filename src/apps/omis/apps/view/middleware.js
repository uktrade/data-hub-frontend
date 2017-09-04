const { setHomeBreadcrumb } = require('../../../middleware')
const { Order } = require('../../models')

function setOrderBreadcrumb (req, res, next) {
  const order = res.locals.order

  return setHomeBreadcrumb(order.reference)(req, res, next)
}

async function getQuote (req, res, next) {
  try {
    res.locals.quote = await Order.getQuote(req.session.token, res.locals.order.id)
    next()
  } catch (error) {
    if (error.statusCode === 404) {
      res.locals.quote = {}
      return next()
    }

    next(error)
  }
}

module.exports = {
  setOrderBreadcrumb,
  getQuote,
}
