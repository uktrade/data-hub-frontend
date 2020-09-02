const { getOptions } = require('../../../../../lib/options')
const { CreateController } = require('../../../controllers')

class MarketController extends CreateController {
  async configure(req, res, next) {
    try {
      const markets = await getOptions(req, 'omis-market')

      req.form.options.fields.primary_market.options = markets
      super.configure(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = MarketController
