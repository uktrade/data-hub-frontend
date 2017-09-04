const { filter } = require('lodash')

const metadataRepo = require('../../../../../lib/metadata')
const { FormController } = require('../../../controllers')
const { transformObjectToOption } = require('../../../../transformers')

class MarketController extends FormController {
  configure (req, res, next) {
    const filterMarkets = filter(metadataRepo.omisMarketOptions, market => !market.disabled_on)

    req.form.options.fields.primary_market.options = filterMarkets.map(transformObjectToOption)
    super.configure(req, res, next)
  }
}

module.exports = MarketController
