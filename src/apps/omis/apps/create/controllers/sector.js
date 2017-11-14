const { get } = require('lodash')

const metadataRepo = require('../../../../../lib/metadata')
const { FormController } = require('../../../controllers')
const { transformObjectToOption } = require('../../../../transformers')

class SectorController extends FormController {
  configure (req, res, next) {
    req.form.options.fields.sector.options = metadataRepo.sectorOptions.map(transformObjectToOption)
    super.configure(req, res, next)
  }

  saveValues (req, res, next) {
    if (get(req.form, 'values.use_sector_from_company') === 'true') {
      req.form.values.sector = get(res.locals, 'company.sector.id')
    }
    super.saveValues(req, res, next)
  }
}

module.exports = SectorController
