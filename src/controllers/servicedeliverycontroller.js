/* eslint camelcase: 0 */
const express = require('express')
const winston = require('winston')
const Q = require('q')
const controllerUtils = require('../lib/controllerutils')
const metadataRepository = require('../repositorys/metadatarepository')
const serviceDeliveryRepository = require('../repositorys/servicedeliveryrepository')
const serviceDeliverylabels = require('../labels/servicedelivery')
const serviceDeliveryService = require('../services/servicedeliveryservice')
const formatDate = require('../lib/date').formatDate

const router = express.Router()

function getCommon (req, res, next) {
  Q.spawn(function *() {
    try {
      const token = req.session.token
      res.locals.serviceDelivery = yield serviceDeliveryService.getHydratedServiceDelivery(token, req.params.serviceDeliveryId)
      next()
    } catch (error) {
      winston.error(error)
      res.errors = error
      next()
    }
  })
}

function getServiceDeliveryEdit (req, res, next) {
  Q.spawn(function *() {
    try {
      const token = req.session.token
      const dit_advisor = req.session.user

      if (!res.locals.serviceDelivery) {
        if (req.query.contactId) {
          res.locals.serviceDelivery = yield serviceDeliveryService.createBlankServiceDeliveryForContact(token, dit_advisor, req.query.contactId)
        } else if (req.query.companyId) {
          res.locals.serviceDelivery = yield serviceDeliveryService.createBlankServiceDeliveryForCompany(token, dit_advisor, req.query.companyId)
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

      res.render('interaction/servicedelivery-edit')
    } catch (error) {
      winston.error(error)
      next(error)
    }
  })
}

function postServiceDeliveryEdit (req, res, next) {
  Q.spawn(function *main () {
    try {
      req.body.date = `${req.body.date_year}-${req.body.date_month}-${req.body.date_day}T00:00:00.00Z`
      delete req.body.date_year
      delete req.body.date_month
      delete req.body.date_day

      controllerUtils.nullEmptyFields(req.body)
      const deliveryToSave = yield serviceDeliveryService.convertServiceDeliveryFormToApiFormat(req.body)
      const result = yield serviceDeliveryRepository.saveServiceDelivery(req.session.token, deliveryToSave)
      res.redirect(`/servicedelivery/${result.data.id}/details`)
    } catch (response) {
      try {
        if (response.error && response.error.errors) {
          res.locals.errors = controllerUtils.transformV2Errors(response.error.errors)
          try {
            res.locals.serviceDelivery = yield serviceDeliveryService.convertFormBodyBackToServiceDelivery(req.session.token, req.body)
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
  const serviceDelivery = res.locals.serviceDelivery

  res.locals.displayValues = {
    company: `<a href="/company/company_company/${serviceDelivery.company.id}">${serviceDelivery.company.name}</a>`,
    dit_team: serviceDelivery.dit_team.name,
    service: serviceDelivery.service.name,
    status: serviceDelivery.status.name,
    subject: serviceDelivery.subject,
    notes: serviceDelivery.notes,
    date: formatDate(serviceDelivery.date),
    contact: `<a href="/contact/${serviceDelivery.contact.id}">${serviceDelivery.contact.first_name} ${serviceDelivery.contact.last_name}</a>`,
    dit_advisor: serviceDelivery.dit_advisor.name,
    uk_region: serviceDelivery.uk_region.name,
    sector: serviceDelivery.sector.name,
    country_of_interest: serviceDelivery.country_of_interest.name
  }
  res.locals.labels = serviceDeliverylabels

  res.render('interaction/servicedelivery-details')
}

router.get('/servicedelivery/:serviceDeliveryId/*', getCommon)
router.get(['/servicedelivery/:serviceDeliveryId/edit', '/servicedelivery/edit/'], getServiceDeliveryEdit)
router.post(['/servicedelivery/:serviceDeliveryId/edit', '/servicedelivery/edit/'], postServiceDeliveryEdit)
router.get('/servicedelivery/:serviceDeliveryId/details', getServiceDeliveryDetails)

module.exports = { router }
