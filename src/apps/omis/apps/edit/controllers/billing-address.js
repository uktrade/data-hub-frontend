const { get } = require('lodash')

const { getOptions } = require('../../../../../lib/options')
const { EditController } = require('../../../controllers')

class EditBillingAddressController extends EditController {
  async configure (req, res, next) {
    const countries = await getOptions(req.session.token, 'country')
    req.form.options.fields.billing_address_country.options = countries

    if (req.form.options.disableFormAction) {
      req.form.options.disableFormAction = !get(res.locals, 'order.canEditInvoiceDetails')
    }

    super.configure(req, res, next)
  }
}

module.exports = EditBillingAddressController
