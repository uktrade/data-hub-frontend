const { forEach, get, pick, pickBy } = require('lodash')

const FormController = require('./form')
const { Order } = require('../models')

class EditController extends FormController {
  async successHandler (req, res, next) {
    const data = pick(req.sessionModel.toJSON(), Object.keys(req.form.options.fields))

    try {
      const order = await Order.update(req.session.token, res.locals.order.id, data)

      req.journeyModel.reset()
      req.journeyModel.destroy()
      req.sessionModel.reset()
      req.sessionModel.destroy()

      req.flash('success', 'Order updated')
      res.redirect(`/omis/${order.id}`)
    } catch (error) {
      next(error)
    }
  }

  getValues (req, res, next) {
    const values = req.sessionModel.toJSON()
    const errors = req.sessionModel.get('errors')
    let errorValues = req.sessionModel.get('errorValues')

    delete values.errorValues
    delete values.errors

    forEach(req.form.options.fields, (value, key) => {
      values[key] = get(res.locals, `order.${key}.id`)
    })

    errorValues = pick(errorValues, Object.keys(req.form.options.fields))
    errorValues = pickBy(errorValues, (e, k) => !errors || !errors[k] || !errors[k].url || errors[k].url === req.path)

    next(null, Object.assign(values, errorValues))
  }
}

module.exports = EditController
