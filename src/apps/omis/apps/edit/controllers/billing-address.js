const { EditController } = require('../../../controllers')
const { transformObjectToOption } = require('../../../../transformers')
const metadataRepo = require('../../../../../lib/metadata')

class EditBillingAddressController extends EditController {
  configure (req, res, next) {
    req.form.options.fields.billing_address_country.options = metadataRepo.countryOptions.map(transformObjectToOption)
    super.configure(req, res, next)
  }
}

module.exports = EditBillingAddressController
