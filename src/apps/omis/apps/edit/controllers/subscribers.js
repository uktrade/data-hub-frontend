const { get, sortBy, pick } = require('lodash')

const { EditController } = require('../../../controllers')
const { getAdvisers } = require('../../../../adviser/repos')
const { transformObjectToOption, transformIdToObject } = require('../../../../transformers')
const { Order } = require('../../../models')

class EditSubscribersController extends EditController {
  async configure (req, res, next) {
    const orderId = get(res.locals, 'order.id')
    const canEditAdvisers = get(res.locals, 'order.canEditAdvisers')
    const token = get(req.session, 'token')
    const advisers = await getAdvisers(token)
    const subscribers = await Order.getSubscribers(token, orderId)
    const options = advisers.results.map(transformObjectToOption)

    req.form.options.disableFormAction = !canEditAdvisers
    req.form.options.fields.subscribers.options = sortBy(options, 'label')

    res.locals.order.subscribers = subscribers

    super.configure(req, res, next)
  }

  async successHandler (req, res, next) {
    const data = pick(req.sessionModel.toJSON(), Object.keys(req.form.options.fields))
    const subscribers = data.subscribers.map(transformIdToObject)

    try {
      await Order.saveSubscribers(req.session.token, res.locals.order.id, subscribers)
      const nextUrl = req.form.options.next || `/omis/${res.locals.order.id}`

      req.journeyModel.reset()
      req.journeyModel.destroy()
      req.sessionModel.reset()
      req.sessionModel.destroy()

      req.flash('success', 'Order updated')
      res.redirect(nextUrl)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = EditSubscribersController
