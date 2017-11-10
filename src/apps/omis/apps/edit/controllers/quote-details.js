const chrono = require('chrono-node')
const dateFns = require('date-fns')

const { EditController } = require('../../../controllers')

class EditQuoteDetailsController extends EditController {
  process (req, res, next) {
    const deliveryDateStr = req.body.delivery_date
    const parsedDeliveryDate = chrono.en_GB.parseDate(deliveryDateStr)

    if (parsedDeliveryDate) {
      req.form.values.delivery_date = dateFns.format(parsedDeliveryDate, 'YYYY-MM-DD')
    } else {
      req.form.values.delivery_date = deliveryDateStr
    }
    next()
  }

  // TODO: Temporary fix as API won't expect empty string for delivery_date
  // Either need to allow empty string in API or find a better way to transform
  // emptry string to null before sending.
  //
  // Can't set to null during `process()` call as `null` failes date validation
  saveValues (req, res, next) {
    if (!req.form.values.delivery_date) {
      req.form.values.delivery_date = null
    }
    super.saveValues(req, res, next)
  }
}

module.exports = EditQuoteDetailsController
