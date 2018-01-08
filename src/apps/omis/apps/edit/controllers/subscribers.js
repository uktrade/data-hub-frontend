const { get, find, map, pick } = require('lodash')

const { EditController } = require('../../../controllers')
const { getAdvisers } = require('../../../../adviser/repos')
const { Order } = require('../../../models')

class EditSubscribersController extends EditController {
  async configure (req, res, next) {
    try {
      const orderId = get(res.locals, 'order.id')
      const canEditAdvisers = get(res.locals, 'order.canEditAdvisers')
      const token = get(req.session, 'token')
      const advisers = await getAdvisers(token)
      const subscribers = await Order.getSubscribers(token, orderId)
      const options = map(advisers.results, 'name')

      req.form.options.disableFormAction = !canEditAdvisers
      req.form.options.fields.subscribers.options = options.sort()

      res.locals.order.subscribers = subscribers
      res.locals.advisers = advisers.results

      super.configure(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  async successHandler (req, res, next) {
    const data = pick(req.sessionModel.toJSON(), Object.keys(req.form.options.fields))
    // const subscribers = data.subscribers.map(transformIdToObject)
    const subscribers = data.subscribers.map((name) => {
      const adviser = find(res.locals.advisers, { name })

      if (!adviser) { return }

      return {
        id: adviser.id,
      }
    })

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
