/* eslint camelcase: 0 */
const serviceDeliverylabels = require('./labels')
const { transformV2Errors } = require('../../lib/controller-utils')
const { nullEmptyFields, deleteNulls } = require('../../lib/property-helpers')
const metadataRepository = require('../../repos/metadata.repo')
const serviceDeliveryRepository = require('./service-deliveries.repo')
const serviceDeliveryService = require('./services/data.service')
const { getDisplayServiceDelivery } = require('./services/formatting.service')
const { buildCompanyUrl } = require('../companies/services/data.service')

const serviceDeliveryDisplayOrder = ['company', 'dit_team', 'service', 'status', 'subject', 'notes', 'date', 'dit_adviser', 'uk_region', 'sector', 'contact', 'country_of_interest']

async function getCommon (req, res, next) {
  try {
    const token = req.session.token
    // if we are creating a new service delivery then the id comes through as edit
    // @TODO make the routes a bit more sensible
    if (req.params.serviceDeliveryId === 'edit') {
      return {}
    } else {
      res.locals.serviceDelivery = await serviceDeliveryService.getHydratedServiceDelivery(token, req.params.serviceDeliveryId)
    }
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
      res.locals.backUrl = `/servicedelivery/${req.params.serviceDeliveryId}/details`
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
    res.locals.title = 'Add service delivery'

    res.render('interaction/service-delivery-edit')
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
    res.redirect(`/servicedelivery/${result.data.id}/details`)
  } catch (response) {
    try {
      if (response.error && response.error.errors) {
        res.locals.errors = transformV2Errors(response.error.errors)
        try {
          res.locals.serviceDelivery = await serviceDeliveryService.convertFormBodyBackToServiceDelivery(req.session.token, req.body)
          res.locals.title = 'Edit service delivery'
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
  res.locals.serviceDeliveryDetails = getDisplayServiceDelivery(res.locals.serviceDelivery)
  res.locals.serviceDeliveryLabels = serviceDeliverylabels
  res.locals.serviceDeliveryDisplayOrder = serviceDeliveryDisplayOrder
  res.render('interaction/service-delivery-details')
}

module.exports = {
  getCommon,
  getServiceDeliveryDetails,
  getServiceDeliveryEdit,
  postServiceDeliveryEdit,
}
