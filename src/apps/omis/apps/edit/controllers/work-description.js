const { filter, find, flatten } = require('lodash')
const chrono = require('chrono-node')
const dateFns = require('date-fns')

const { EditController } = require('../../../controllers')
const { transformObjectToOption } = require('../../../../transformers')
const metadataRepo = require('../../../../../lib/metadata')

class EditWorkDescriptionController extends EditController {
  configure (req, res, next) {
    const filteredServiceTypes = filter(metadataRepo.orderServiceTypesOptions, (service) => {
      if (!service.disabled_on) { return true }

      const serviceDisabledDate = Date.parse(service.disabled_on)
      const orderCreatedDate = Date.parse(res.locals.order.created_on)

      if (serviceDisabledDate > orderCreatedDate) {
        return true
      }

      if (find(res.locals.order.service_types, { id: service.id })) {
        return true
      }

      return false
    })

    req.form.options.fields.sector.options = metadataRepo.sectorOptions.map(transformObjectToOption)
    req.form.options.fields.service_types.options = filteredServiceTypes.map(transformObjectToOption)
    super.configure(req, res, next)
  }

  process (req, res, next) {
    const deliveryDateStr = req.body.delivery_date
    const parsedDeliveryDate = chrono.en_GB.parseDate(deliveryDateStr)

    if (parsedDeliveryDate) {
      req.form.values.delivery_date = dateFns.format(parsedDeliveryDate, 'YYYY-MM-DD')
    } else {
      req.form.values.delivery_date = deliveryDateStr
    }

    req.form.values.service_types = filter(flatten([req.form.values.service_types]))
    next()
  }

  // TODO: Temporary fix as API won't expect empty string for delivery_date
  // Either need to allow empty string in API or find a better way to transform
  // emptry string to null before sending.
  //
  // Can't set to null during `process()` call as `null` failes date validation
  saveValues (req, res, next) {
    if (!req.form.values.delivery_date) {
      req.form.values.delivery_date = null
    }
    super.saveValues(req, res, next)
  }
}

module.exports = EditWorkDescriptionController
