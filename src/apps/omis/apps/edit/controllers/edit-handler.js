const { reduce } = require('lodash')

const EditController = require('../../../controllers/edit')
const steps = require('../steps')
const fields = require('../fields')

function editHandler (req, res, next) {
  const step = steps[`/${req.params.step}`]
  const order = res.locals.order
  const nextUrl = req.query.returnUrl || `/omis/${order.id}/work-order`

  if (!step || !order) { return next() }

  const defaults = {
    buttonText: 'Save and return',
    returnText: 'Return without saving',
    disableFormAction: !order.canEditOrder,
    journeyName: 'edit',
    name: 'edit',
    route: '/edit',
    template: '_layouts/form-wizard-step',
    next: nextUrl,
    backLink: nextUrl,
    controller: EditController,
    successMessage: 'Changes saved',
  }
  const overrides = {
    fields: reduce(step.fields, (result, field) => {
      result[field] = fields[field] || {}
      return result
    }, {}),
  }
  const options = Object.assign(defaults, step, overrides)
  const ControllerClass = options.controller

  new ControllerClass(options).requestHandler()(req, res, next)
}

module.exports = editHandler
