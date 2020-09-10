const { assign, filter, flatten, get } = require('lodash')

const { EditController } = require('../../../controllers')
const { Order } = require('../../../models')

class CompleteOrderController extends EditController {
  async configure(req, res, next) {
    if (get(res.locals, 'order.status') !== 'paid') {
      return res.redirect(`/omis/${res.locals.order.id}`)
    }

    const orderId = get(res.locals, 'order.id')
    const assignees = await Order.getAssignees(req, orderId)

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

  process(req, res, next) {
    req.form.values.assignee_actual_time = flatten([
      req.form.values.assignee_actual_time,
    ])
    next()
  }

  async saveValues(req, res, next) {
    const data = req.form.values
    const timeValues = flatten([data.assignee_actual_time])
    const assignees = timeValues.map((value, index) => {
      if (!value) {
        return
      }

      return {
        adviser: {
          id: res.locals.assignees[index].adviser.id,
        },
        actual_time: parseInt(value) * 60,
      }
    })

    try {
      await Order.saveAssignees(req, res.locals.order.id, filter(assignees))
      await Order.complete(req, res.locals.order.id)
      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = CompleteOrderController
