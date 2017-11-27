const { get, pick, sortBy } = require('lodash')

const { EditController } = require('../../../controllers')
const { getAdvisers } = require('../../../../adviser/repos')
const { transformObjectToOption } = require('../../../../transformers')
const { Order } = require('../../../models')

class EditAssigneesController extends EditController {
  async configure (req, res, next) {
    try {
      const orderId = get(res.locals, 'order.id')
      const canEditOrder = get(res.locals, 'order.canEditOrder')
      const canEditAdvisers = get(res.locals, 'order.canEditAdvisers')
      const token = get(req.session, 'token')
      const advisers = await getAdvisers(token)
      const assignees = await Order.getAssignees(token, orderId)
      const options = advisers.results.map(transformObjectToOption)

      req.form.options.fields.assignees.options = sortBy(options, 'label')
      req.form.options.fields.assignees.canRemove = canEditOrder
      req.form.options.disableFormAction = !canEditAdvisers

      res.locals.order.assignees = assignees

      super.configure(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  async successHandler (req, res, next) {
    const data = pick(req.sessionModel.toJSON(), Object.keys(req.form.options.fields))
    const assignees = data.assignees.map((id) => {
      return {
        adviser: { id },
      }
    })

    try {
      const orderId = get(res.locals, 'order.id')
      const canEditOrder = get(res.locals, 'order.canEditOrder')
      const token = get(req.session, 'token')
      const nextUrl = get(req, 'form.options.next') || `/omis/${orderId}`

      if (canEditOrder) {
        await Order.forceSaveAssignees(token, orderId, assignees)
      } else {
        await Order.saveAssignees(token, orderId, assignees)
      }

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

module.exports = EditAssigneesController
