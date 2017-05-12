/* eslint camelcase: 0 */
const express = require('express')
const winston = require('winston')
const Q = require('q')
const interactionLabels = require('../labels/interactionlabels')
const {genCSRF} = require('../lib/controller-utils')
const metadataRepository = require('../repos/metadata.repo')
const interactionDataService = require('../services/interaction-data.service')
const {getDisplayInteraction} = require('../services/interaction-formatting.service')

const interactonDisplayOrder = ['company', 'interaction_type', 'subject', 'notes', 'contact', 'date', 'dit_advisor', 'service', 'dit_team']
const router = express.Router()

function getCommon (req, res, next) {
  Q.spawn(function * () {
    try {
      const token = req.session.token
      if (req.params.interactionId && req.params.interactionId !== 'add') {
        res.locals.interaction = yield interactionDataService.getHydratedInteraction(token, req.params.interactionId)
      }
      next()
    } catch (error) {
      winston.error(error)
      res.render('error', { error: 'Error loading interaction' })
    }
  })
}

function getAddStep1 (req, res) {
  genCSRF(req, res)
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
    return res.redirect(`/servicedelivery/edit/?company=${req.body.company}&contact=${req.body.contact}`)
  }

  return res.redirect(`/interaction/add/?company=${req.body.company}&contact=${req.body.contact}&interaction_type=${req.body.interaction_type}`)
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
router.get('/interaction/:interactionId/details', getInteractionDetails)

module.exports = { router }
