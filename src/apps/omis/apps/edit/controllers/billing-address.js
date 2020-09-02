const { get } = require('lodash')

const { getOptions } = require('../../../../../lib/options')
const { EditController } = require('../../../controllers')

class EditBillingAddressController extends EditController {
  async configure(req, res, next) {
    const countries = await getOptions(req, 'country')
    req.form.options.fields.billing_address_country.options = countries

    if (req.form.options.disableFormAction) {
      req.form.options.disableFormAction = !get(
        res.locals,
        'order.canEditInvoiceDetails'
      )
    }

    super.configure(req, res, next)
  }

  successHandler(req, res) {
    const newBillingCountry = get(req, 'form.values.billing_address_country')
    const oldBillingCountry = get(
      res.locals,
      'order.billing_address_country.id'
    )
    const hasBillingCountryChanged = newBillingCountry !== oldBillingCountry

    if (newBillingCountry && oldBillingCountry && hasBillingCountryChanged) {
      req.hasChanged = true
      req.form.options.successMessage = null
    }

    super.successHandler(req, res)
  }

  nextCondition(req) {
    return req.hasChanged
  }
}

module.exports = EditBillingAddressController
