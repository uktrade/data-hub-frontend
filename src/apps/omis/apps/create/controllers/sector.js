const { get } = require('lodash')

const { getOptions } = require('../../../../../lib/options')
const { CreateController } = require('../../../controllers')

class SectorController extends CreateController {
  async configure(req, res, next) {
    try {
      const sectors = await getOptions(req, 'sector')

      req.form.options.fields.sector.options = sectors
      super.configure(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  saveValues(req, res, next) {
    if (get(req.form, 'values.use_sector_from_company') === 'true') {
      req.form.values.sector = get(res.locals, 'company.sector.id')
    }
    super.saveValues(req, res, next)
  }
}

module.exports = SectorController
