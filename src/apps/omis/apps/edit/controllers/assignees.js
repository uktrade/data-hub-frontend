const { pick, sortBy } = require('lodash')

const { EditController } = require('../../../controllers')
const { getAllAdvisers } = require('../../../../adviser/repos')
const { transformObjectToOption } = require('../../../../transformers')
const { Order } = require('../../../models')

class EditAssigneesController extends EditController {
  async configure (req, res, next) {
    const advisers = await getAllAdvisers(req.session.token)
    const options = advisers.results.map(transformObjectToOption)

    req.form.options.fields.assignees.options = sortBy(options, 'label')
    super.configure(req, res, next)
  }

  async successHandler (req, res, next) {
    const data = pick(req.sessionModel.toJSON(), Object.keys(req.form.options.fields))
    const assignees = data.assignees.map((id) => {
      return {
        adviser: {
          id,
        },
      }
    })

    try {
      await Order.forceSaveAssignees(req.session.token, res.locals.order.id, assignees)

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

module.exports = EditAssigneesController
