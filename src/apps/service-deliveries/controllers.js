/* eslint camelcase: 0 */
const serviceDeliverylabels = require('./labels')
const { transformV2Errors } = require('../../lib/controller-utils')
const { nullEmptyFields, deleteNulls } = require('../../lib/property-helpers')
const metadataRepository = require('../../lib/metadata')
const serviceDeliveryRepository = require('./repos')
const serviceDeliveryService = require('./services/data')
const { getDisplayServiceDelivery } = require('./services/formatting')
const { buildCompanyUrl } = require('../companies/services/data')

const serviceDeliveryDisplayOrder = ['company', 'dit_team', 'service', 'status', 'subject', 'notes', 'date', 'dit_adviser', 'uk_region', 'sector', 'contact', 'country_of_interest']

async function getCommon (req, res, next) {
  try {
    const token = req.session.token
    res.locals.serviceDelivery = await serviceDeliveryService.getHydratedServiceDelivery(token, req.params.serviceDeliveryId)
    next()
  } catch (error) {
    next(error)
  }
}

async function getServiceDeliveryEdit (req, res, next) {
  try {
    const token = req.session.token
    const adviser = req.session.user
    if (!res.locals.serviceDelivery) {
      if (req.query.contact) {
        res.locals.serviceDelivery = await serviceDeliveryService.createBlankServiceDeliveryForContact(token, adviser, req.query.contact)
      } else if (req.query.company) {
        res.locals.serviceDelivery = await serviceDeliveryService.createBlankServiceDeliveryForCompany(token, adviser, req.query.company)
      }
    } else {
      res.locals.backUrl = `/service-deliveries/${req.params.serviceDeliveryId}`
    }
    res.locals.contacts = res.locals.serviceDelivery.company.contacts.map((contact) => {
      return {
        id: contact.id,
        name: `${contact.first_name} ${contact.last_name}`,
      }
    })

    res.locals.labels = serviceDeliverylabels
    res.locals.serviceProviderOptions = metadataRepository.teams
    res.locals.serviceOptions = metadataRepository.serviceDeliveryServiceOptions
    res.locals.countryOptions = metadataRepository.countryOptions
    res.locals.sectorOptions = metadataRepository.sectorOptions
    res.locals.regionOptions = metadataRepository.regionOptions
    res.locals.statusOptions = metadataRepository.serviceDeliveryStatusOptions
    res.locals.eventOptions = metadataRepository.eventOptions
    res.locals.companyUrl = buildCompanyUrl(res.locals.serviceDelivery.company)

    res
      .breadcrumb('Edit service delivery')
      .render('service-deliveries/views/edit')
  } catch (error) {
    next(error)
  }
}

async function postServiceDeliveryEdit (req, res, next) {
  try {
    req.body.date = `${req.body.date_year}-${req.body.date_month}-${req.body.date_day}T00:00:00.00Z`
    delete req.body.date_year
    delete req.body.date_month
    delete req.body.date_day

    // v2 endpoint rejects nulls
    req.body = deleteNulls(nullEmptyFields(req.body))
    const deliveryToSave = await serviceDeliveryService.convertServiceDeliveryFormToApiFormat(req.body)
    const result = await serviceDeliveryRepository.saveServiceDelivery(req.session.token, deliveryToSave)
    res.redirect(`/service-deliveries/${result.data.id}`)
  } catch (response) {
    try {
      if (response.error && response.error.errors) {
        res.locals.errors = transformV2Errors(response.error.errors)
        try {
          res.locals.serviceDelivery = await serviceDeliveryService.convertFormBodyBackToServiceDelivery(req.session.token, req.body)
          res.breadcrumb('Edit service delivery')
        } catch (error) {
          return next(error)
        }
        return getServiceDeliveryEdit(req, res, next)
      }
    } catch (error) {
      return next(error)
    }
    next(response.error)
  }
}

function getServiceDeliveryDetails (req, res, next) {
  res.locals = Object.assign({}, res.locals, {
    serviceDeliveryDetails: getDisplayServiceDelivery(res.locals.serviceDelivery),
    serviceDeliveryLabels: serviceDeliverylabels,
    serviceDeliveryDisplayOrder: serviceDeliveryDisplayOrder,
  })

  res
    .breadcrumb('Service delivery details')
    .render('service-deliveries/views/details')
}

module.exports = {
  getCommon,
  getServiceDeliveryDetails,
  getServiceDeliveryEdit,
  postServiceDeliveryEdit,
}
