const { assign, filter, flatten, get, pick } = require('lodash')

const { EditController } = require('../../../controllers')
const { Order } = require('../../../models')

class CompleteOrderController extends EditController {
  async configure (req, res, next) {
    if (get(res.locals, 'order.status') !== 'paid') {
      return res.redirect(`/omis/${res.locals.order.id}`)
    }

    const orderId = get(res.locals, 'order.id')
    const token = get(req.session, 'token')
    const assignees = await Order.getAssignees(token, orderId)

    if (!assignees.length) {
      req.form.options.hidePrimaryFormAction = true
    }

    req.form.options = assign({}, req.form.options, {
      disableFormAction: false,
      buttonText: 'Complete order',
    })

    res.locals.assignees = assignees

    super.configure(req, res, next)
  }

  async successHandler (req, res, next) {
    const data = pick(req.sessionModel.toJSON(), Object.keys(req.form.options.fields))
    const timeValues = flatten([data.assignee_actual_time])
    const assignees = timeValues.map((value, index) => {
      if (!value) { return }

      return {
        adviser: {
          id: res.locals.assignees[index].adviser.id,
        },
        actual_time: parseInt(value) * 60,
      }
    })

    try {
      await Order.saveAssignees(req.session.token, res.locals.order.id, filter(assignees))
      await Order.complete(req.session.token, res.locals.order.id)
      const nextUrl = req.form.options.next || `/omis/${res.locals.order.id}`

      req.journeyModel.reset()
      req.journeyModel.destroy()
      req.sessionModel.reset()
      req.sessionModel.destroy()

      req.flash('success', 'Order completed')
      res.redirect(nextUrl)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = CompleteOrderController
