const Controller = require('./base')
const metadataRepo = require('../../../../../lib/metadata')
const { transformToOptions } = require('../../../../transformers')

class MarketController extends Controller {
  configure (req, res, next) {
    req.form.options.fields.primary_market.options = transformToOptions(metadataRepo.countryOptions)
    super.configure(req, res, next)
  }
}

module.exports = MarketController
