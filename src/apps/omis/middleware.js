const { get } = require('lodash')

const logger = require('../../../config/logger')
const { getInflatedDitCompany } = require('../companies/services/data')
const { setHomeBreadcrumb } = require('../middleware')
const { Order } = require('./models')

async function getCompany (req, res, next, companyId) {
  try {
    res.locals.company = await getInflatedDitCompany(req.session.token, companyId)
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
