const { filter, flatten, get } = require('lodash')

const { EditController } = require('../../../controllers')
const { Order } = require('../../../models')

class EditAssigneeTimeController extends EditController {
  async configure(req, res, next) {
    const orderId = get(res.locals, 'order.id')
    const assignees = await Order.getAssignees(req, orderId)

    if (!assignees.length) {
      req.form.options.hidePrimaryFormAction = true
    }

    res.locals.assignees = assignees

    super.configure(req, res, next)
  }

  process(req, res, next) {
    req.form.values.assignee_time = flatten([req.form.values.assignee_time])
    next()
  }

  async saveValues(req, res, next) {
    const data = req.form.values
    const timeValues = flatten([data.assignee_time])
    const assignees = timeValues.map((value, index) => {
      return {
        adviser: {
          id: res.locals.assignees[index].adviser.id,
        },
        estimated_time: parseInt(value || 0) * 60,
      }
    })

    try {
      await Order.saveAssignees(req, res.locals.order.id, filter(assignees))
      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = EditAssigneeTimeController
