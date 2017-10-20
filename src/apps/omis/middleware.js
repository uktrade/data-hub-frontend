const { get } = require('lodash')

const logger = require('../../../config/logger')
const { getDitCompany } = require('../companies/repos')
const { setHomeBreadcrumb } = require('../middleware')
const { Order } = require('./models')

async function getCompany (req, res, next, companyId) {
  try {
    res.locals.company = await getDitCompany(req.session.token, companyId)
    next()
  } catch (error) {
    next(error)
  }
}

async function getOrder (req, res, next, orderId) {
  try {
    const order = await Order.getById(req.session.token, orderId)
    const subscribers = await Order.getSubscribers(req.session.token, orderId)
    const assignees = await Order.getAssignees(req.session.token, orderId)

    res.locals.order = Object.assign({}, order, {
      subscribers,
      assignees,
      isEditable: order.status === 'draft',
      net_cost: parseInt(order.net_cost) / 100,
      vat_cost: parseInt(order.vat_cost) / 100,
      total_cost: parseInt(order.total_cost) / 100,
    })
  } catch (e) {
    logger.error(e)
  }
  next()
}

function setOrderBreadcrumb (req, res, next) {
  const reference = get(res.locals, 'order.reference')

  return setHomeBreadcrumb(reference)(req, res, next)
}

module.exports = {
  getCompany,
  getOrder,
  setOrderBreadcrumb,
}
