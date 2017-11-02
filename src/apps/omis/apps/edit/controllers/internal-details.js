const { filter, find, flatten } = require('lodash')

const { EditController } = require('../../../controllers')
const { transformObjectToOption } = require('../../../../transformers')
const metadataRepo = require('../../../../../lib/metadata')

class EditInternalDetailsController extends EditController {
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
    req.form.values.service_types = filter(flatten([req.form.values.service_types]))
    next()
  }
}

module.exports = EditInternalDetailsController
