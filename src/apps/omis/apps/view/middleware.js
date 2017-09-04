const { setHomeBreadcrumb } = require('../../../middleware')

function setOrderBreadcrumb (req, res, next) {
  const order = res.locals.order

  return setHomeBreadcrumb(order.reference)(req, res, next)
}

module.exports = {
  setOrderBreadcrumb,
}
