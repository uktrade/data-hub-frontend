/* eslint camelcase: 0 */
const express = require('express')
const winston = require('winston')
const Q = require('q')
const interactionLabels = require('../labels/interaction')
const controllerUtils = require('../lib/controllerutils')
const interactionRepository = require('../repositorys/interactionrepository')
const metadataRepository = require('../repositorys/metadatarepository')
const interactionService = require('../services/interactionservice')
const {getDisplayInteraction} = require('../services/interactionformattingservice')

const interactonDisplayOrder = ['company', 'interaction_type', 'subject', 'notes', 'contact', 'date', 'dit_advisor', 'service', 'dit_team']
const router = express.Router()

function getCommon (req, res, next) {
  Q.spawn(function *() {
    try {
      const token = req.session.token
      res.locals.interaction = yield interactionService.getHydratedInteraction(token, req.params.interactionId)
      next()
    } catch (error) {
      winston.error(error)
      res.render('error', { error: 'Error loading interaction' })
    }
  })
}

function getAddStep1 (req, res) {
  controllerUtils.genCSRF(req, res)
  const interactionTypes = [...metadataRepository.interactionTypeOptions, { id: 999, name: 'Service delivery', selectable: true }]

  const selectableTypes = interactionTypes
    .filter(selectableType => selectableType.selectable)
    .sort((a, b) => {
      const nameA = a.name.toUpperCase()
      const nameB = b.name.toUpperCase()
      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1
      }
      return 0
    })

  // Split the list into 2 to show as 2 columns
  const halfWay = Math.ceil(selectableTypes.length / 2)
  const interactionTypeColA = []
  const interactionTypeColB = []

  for (let pos = 0; pos < halfWay; pos += 1) {
    interactionTypeColA.push(selectableTypes[pos])
  }

  for (let pos = halfWay; pos < selectableTypes.length; pos += 1) {
    interactionTypeColB.push(selectableTypes[pos])
  }

  res.render('interaction/add-step-1.html', {
    query: req.query,
    interactionTypeColA,
    interactionTypeColB
  })
}

function postAddStep1 (req, res) {
  // error if no selection
  if (!req.body.interaction_type) {
    res.locals.errors = {
      interaction_type: ['You must select an interaction type']
    }
    return getAddStep1(req, res)
  }

  // redirect to edit, passing param
  if (req.body.interaction_type === '999') {
    return res.redirect(`/servicedelivery/edit/?companyId=${req.body.companyId}&contactId=${req.body.contactId}`)
  }

  return res.redirect(`/interaction/edit/?companyId=${req.body.companyId}&contactId=${req.body.contactId}&interaction_type=${req.body.interaction_type}`)
}

function getInteractionEdit (req, res, next) {
  controllerUtils.genCSRF(req, res)
  Q.spawn(function *() {
    try {
      const token = req.session.token
      const dit_advisor = req.session.user

      if (!res.locals.interaction) {
        if (req.query.contactId) {
          res.locals.interaction = yield interactionService.createBlankInteractionForContact(token, dit_advisor, req.query.interaction_type, req.query.contactId)
        } else if (req.query.companyId) {
          res.locals.interaction = yield interactionService.createBlankInteractionForCompany(token, dit_advisor, req.query.interaction_type, req.query.companyId)
        }
      } else {
        res.locals.backUrl = `/interaction/${req.params.interactionId}/details`
      }

      res.locals.contacts = res.locals.interaction.company.contacts.map((contact) => {
        return {
          id: contact.id,
          name: `${contact.first_name} ${contact.last_name}`
        }
      })

      res.locals.serviceOfferOptions = yield metadataRepository.getServiceOffers(token)
      res.locals.serviceProviderOptions = metadataRepository.teams
      res.locals.labels = interactionLabels

      res.render('interaction/interaction-edit')
    } catch (error) {
      winston.error(error)
      next(error)
    }
  })
}

function postInteractionEdit (req, res, next) {
  Q.spawn(function *() {
    try {
      req.body.date = `${req.body.date_year}-${req.body.date_month}-${req.body.date_day}T00:00:00.00Z`
      delete req.body.date_year
      delete req.body.date_month
      delete req.body.date_day

      controllerUtils.nullEmptyFields(req.body)

      const result = yield interactionRepository.saveInteraction(req.session.token, req.body)
      res.redirect(`/interaction/${result.id}/details`)
    } catch (response) {
      if (response.error && response.error.errors) {
        res.locals.errors = response.error.errors
        try {
          res.locals.interaction = yield interactionService.convertFormBodyBackToInteraction(req.session.token, req.body)
        } catch (error) {
          winston.error(error)
        }
        return getInteractionEdit(req, res, next)
      }
      next(response.error)
    }
  })
}

function getInteractionDetails (req, res, next) {
  res.locals.interactionDetails = getDisplayInteraction(res.locals.interaction)
  res.locals.interactionLabels = interactionLabels
  res.locals.interactionDisplayOrder = interactonDisplayOrder
  res.render('interaction/interaction-details')
}

router.get('/interaction/add-step-1/', getAddStep1)
router.post('/interaction/add-step-1/', postAddStep1)
router.get('/interaction/:interactionId/*', getCommon)
router.get(['/interaction/:interactionId/edit', '/interaction/edit/'], getInteractionEdit)
router.post(['/interaction/:interactionId/edit', '/interaction/edit/'], postInteractionEdit)
router.get('/interaction/:interactionId/details', getInteractionDetails)

module.exports = { router }
