const { get } = require('lodash')

const { EditController } = require('../../../controllers')

class EditVatStatusController extends EditController {
  configure(req, res, next) {
    if (req.form.options.disableFormAction) {
      req.form.options.disableFormAction = !get(
        res.locals,
        'order.canEditInvoiceDetails'
      )
    }
    super.configure(req, res, next)
  }

  getValues(req, res, next) {
    super.getValues(req, res, (err, values) => {
      const errorValues = req.sessionModel.get('errorValues')

      values.vat_status = get(errorValues, 'vat_status')
      next(err, values)
    })
  }
}

module.exports = EditVatStatusController
