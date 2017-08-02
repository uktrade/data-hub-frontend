const metadataRepo = require('../../../../../lib/metadata')
const { FormController } = require('../../../controllers')
const { transformObjectToOption } = require('../../../../transformers')

class MarketController extends FormController {
  configure (req, res, next) {
    req.form.options.fields.primary_market.options = metadataRepo.countryOptions.map(transformObjectToOption)
    super.configure(req, res, next)
  }
}

module.exports = MarketController
