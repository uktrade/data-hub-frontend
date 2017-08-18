const { filter, pick } = require('lodash')

const { EditController } = require('../../../controllers')
const { Order } = require('../../../models')

class EditAssigneeHoursController extends EditController {
  async successHandler (req, res, next) {
    const data = pick(req.sessionModel.toJSON(), Object.keys(req.form.options.fields))
    const assignees = data.assignee_time.map((value, index) => {
      if (!value) { return }

      const [ hours, minutes ] = value.split(':')

      return {
        adviser: {
          id: res.locals.order.assignees[index].adviser.id,
        },
        estimated_time: parseInt((hours * 60)) + parseInt(minutes),
      }
    })

    try {
      await Order.saveAssignees(req.session.token, res.locals.order.id, filter(assignees))

      req.journeyModel.reset()
      req.journeyModel.destroy()
      req.sessionModel.reset()
      req.sessionModel.destroy()

      req.flash('success', 'Order updated')
      res.redirect(`/omis/${res.locals.order.id}`)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = EditAssigneeHoursController
