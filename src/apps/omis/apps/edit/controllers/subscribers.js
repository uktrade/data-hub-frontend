const { sortBy, pick } = require('lodash')

const { EditController } = require('../../../controllers')
const { getAllAdvisers } = require('../../../../adviser/repos')
const { transformObjectToOption, transformIdToObject } = require('../../../../transformers')
const { Order } = require('../../../models')

class EditSubscribersController extends EditController {
  async configure (req, res, next) {
    const advisers = await getAllAdvisers(req.session.token)
    const options = advisers.results.map(transformObjectToOption)

    req.form.options.fields.subscribers.options = sortBy(options, 'label')
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
