const { get } = require('lodash')

const { EditController } = require('../../../controllers')

class EditInvoiceDetailsController extends EditController {
  configure(req, res, next) {
    if (req.form.options.disableFormAction) {
      req.form.options.disableFormAction = !get(
        res.locals,
        'order.canEditInvoiceDetails'
      )
    }
    super.configure(req, res, next)
  }
}

module.exports = EditInvoiceDetailsController
