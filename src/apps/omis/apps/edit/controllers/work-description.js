const { flatten } = require('lodash')
const chrono = require('chrono-node')
const dateFns = require('date-fns')

const { EditController } = require('../../../controllers')
const { transformObjectToOption } = require('../../../../transformers')
const metadataRepo = require('../../../../../lib/metadata')

class EditWorkDescriptionController extends EditController {
  configure (req, res, next) {
    req.form.options.fields.sector.options = metadataRepo.sectorOptions.map(transformObjectToOption)
    req.form.options.fields.service_types.options = metadataRepo.orderServiceTypesOptions.map(transformObjectToOption)
    next()
  }

  process (req, res, next) {
    const deliveryDateStr = req.body.delivery_date
    const parsedDeliveryDate = chrono.en_GB.parseDate(deliveryDateStr)

    if (parsedDeliveryDate) {
      req.form.values.delivery_date = dateFns.format(parsedDeliveryDate, 'YYYY-MM-DD')
    } else {
      req.form.values.delivery_date = deliveryDateStr
    }

    req.form.values.service_types = flatten([req.form.values.service_types])
    next()
  }
}

module.exports = EditWorkDescriptionController
