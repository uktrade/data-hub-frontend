const { getOptions } = require('../../../../../lib/options')
const { FormController } = require('../../../controllers')

class MarketController extends FormController {
  async configure (req, res, next) {
    try {
      const markets = await getOptions(req.session.token, 'omis-market')

      req.form.options.fields.primary_market.options = markets
      super.configure(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = MarketController
