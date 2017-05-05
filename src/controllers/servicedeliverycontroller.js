/* eslint camelcase: 0 */
const express = require('express')
const winston = require('winston')
const Q = require('q')
const serviceDeliverylabels = require('../labels/servicedelivery')
const { genCSRF, transformErrors } = require('../lib/controllerutils')
const { nullEmptyFields, deleteNulls } = require('../lib/propertyhelpers')
const metadataRepository = require('../repositorys/metadatarepository')
const serviceDeliveryRepository = require('../repositorys/servicedeliveryrepository')
const serviceDeliveryService = require('../services/servicedeliveryservice')
const { getDisplayServiceDelivery } = require('../services/servicedeliveryformattingservice')
const { getViewCompanyLink } = require('../services/companyservice')

const serviceDeliveryDisplayOrder = ['company', 'dit_team', 'service', 'status', 'subject', 'notes', 'date', 'dit_advisor', 'uk_region', 'sector', 'contact', 'country_of_interest']
const router = express.Router()

function getCommon (req, res, next) {
  Q.spawn(function * () {
    try {
      const token = req.session.token
      // if we are creating a new service delivery then the id comes through as edit
      // @TODO make the routes a bit more sensible
      if (req.params.serviceDeliveryId === 'edit') {
        yield {}
      } else {
        res.locals.serviceDelivery = yield serviceDeliveryService.getHydratedServiceDelivery(token, req.params.serviceDeliveryId)
      }
      next()
    } catch (error) {
      winston.error(error)
      res.render('error', { error: 'Error loading service delivery' })
    }
  })
}

function getServiceDeliveryEdit (req, res, next) {
  genCSRF(req, res)
  Q.spawn(function * () {
    try {
      const token = req.session.token
      const dit_advisor = req.session.user
      if (!res.locals.serviceDelivery) {
        if (req.query.contact) {
          res.locals.serviceDelivery = yield serviceDeliveryService.createBlankServiceDeliveryForContact(token, dit_advisor, req.query.contact)
        } else if (req.query.company) {
          res.locals.serviceDelivery = yield serviceDeliveryService.createBlankServiceDeliveryForCompany(token, dit_advisor, req.query.company)
        }
      } else {
        res.locals.backUrl = `/servicedelivery/${req.params.serviceDeliveryId}/details`
      }
      res.locals.contacts = res.locals.serviceDelivery.company.contacts.map((contact) => {
        return {
          id: contact.id,
          name: `${contact.first_name} ${contact.last_name}`
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
      res.locals.companyUrl = getViewCompanyLink(res.locals.serviceDelivery.company)

      res.render('interaction/servicedelivery-edit')
    } catch (error) {
      winston.error(error)
      next(error)
    }
  })
}

function postServiceDeliveryEdit (req, res, next) {
  Q.spawn(function * () {
    try {
      req.body.date = `${req.body.date_year}-${req.body.date_month}-${req.body.date_day}T00:00:00.00Z`
      delete req.body.date_year
      delete req.body.date_month
      delete req.body.date_day

      // v2 endpoint rejects nulls
      const nullbody = deleteNulls(nullEmptyFields(req.body))

      const deliveryToSave = yield serviceDeliveryService.convertServiceDeliveryFormToApiFormat(nullbody)
      const result = yield serviceDeliveryRepository.saveServiceDelivery(req.session.token, deliveryToSave)
      res.redirect(`/servicedelivery/${result.data.id}/details`)
    } catch (response) {
      try {
        if (response.error && response.error.errors) {
          res.locals.errors = transformErrors(response.error.errors)
          try {
            res.locals.serviceDelivery = yield serviceDeliveryService.convertFormBodyBackToServiceDelivery(req.session.token, nullbody)
          } catch (error) {
            winston.error(error)
          }
          return getServiceDeliveryEdit(req, res, next)
        }
      } catch (error) {
        return next(error)
      }
      next(response.error)
    }
  })
}

function getServiceDeliveryDetails (req, res, next) {
  res.locals.serviceDeliveryDetails = getDisplayServiceDelivery(res.locals.serviceDelivery)
  res.locals.serviceDeliveryLabels = serviceDeliverylabels
  res.locals.serviceDeliveryDisplayOrder = serviceDeliveryDisplayOrder
  res.render('interaction/servicedelivery-details')
}

router.get('/servicedelivery/:serviceDeliveryId/*', getCommon)
router.get(['/servicedelivery/:serviceDeliveryId/edit', '/servicedelivery/edit/'], getServiceDeliveryEdit)
router.post(['/servicedelivery/:serviceDeliveryId/edit', '/servicedelivery/edit/'], postServiceDeliveryEdit)
router.get('/servicedelivery/:serviceDeliveryId/details', getServiceDeliveryDetails)

module.exports = { router }
