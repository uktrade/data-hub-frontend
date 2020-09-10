const { get, sortBy, isString } = require('lodash')

const { EditController } = require('../../../controllers')
const { getAdvisers } = require('../../../../adviser/repos')
const {
  transformObjectToOption,
  transformIdToObject,
} = require('../../../../transformers')
const { Order } = require('../../../models')

class EditSubscribersController extends EditController {
  async configure(req, res, next) {
    try {
      const orderId = get(res.locals, 'order.id')
      const canEditAdvisers = get(res.locals, 'order.canEditAdvisers')
      const advisers = await getAdvisers(req)
      const subscribers = await Order.getSubscribers(req, orderId)
      const options = advisers.results.map(transformObjectToOption)

      req.form.options.disableFormAction = !canEditAdvisers
      req.form.options.fields.subscribers.options = sortBy(options, 'label')

      res.locals.order.subscribers = subscribers

      req.form.options.fields.subscribers.children.forEach((item) => {
        item.options.push(...options)
      })

      super.configure(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  async saveValues(req, res, next) {
    const data = req.form.values
    const subscribersTransform = isString(data.subscribers)
      ? [data.subscribers]
      : data.subscribers
    const subscribers = subscribersTransform.map(transformIdToObject)

    try {
      await Order.saveSubscribers(req, res.locals.order.id, subscribers)
      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = EditSubscribersController
