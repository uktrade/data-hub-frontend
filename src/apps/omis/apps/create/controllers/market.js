const Controller = require('./base')
const metadataRepo = require('../../../../../lib/metadata')
const { transformObjectToOption } = require('../../../../transformers')

class MarketController extends Controller {
  configure (req, res, next) {
    req.form.options.fields.primary_market.options = metadataRepo.countryOptions.map(transformObjectToOption)
    super.configure(req, res, next)
  }
}

module.exports = MarketController
