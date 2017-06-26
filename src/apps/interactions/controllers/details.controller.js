/* eslint camelcase: 0 */
const interactionLabels = require('../labels')
const metadataRepository = require('../../../lib/metadata')
const interactionDataService = require('../services/data.service')
const { getDisplayInteraction } = require('../services/formatting.service')

const interactonDisplayOrder = ['company', 'interaction_type', 'subject', 'notes', 'contact', 'date', 'dit_adviser', 'service', 'dit_team']

async function getCommon (req, res, next) {
  try {
    const token = req.session.token
    if (req.params.interactionId && req.params.interactionId !== 'add') {
      res.locals.interaction = await interactionDataService.getHydratedInteraction(token, req.params.interactionId)
    }
    next()
  } catch (error) {
    next(error)
  }
}

function getAddStep1 (req, res) {
  const interactionTypes = [...metadataRepository.interactionTypeOptions, { id: 999, name: 'Service delivery' }]

  const selectableTypes = interactionTypes
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

  res.render('interactions/views/add-step-1.njk', {
    title: ['Interaction type', 'Add interaction'],
    query: req.query,
    interactionTypeColA,
    interactionTypeColB,
  })
}

function postAddStep1 (req, res) {
  // error if no selection
  if (!req.body.interaction_type) {
    res.locals.errors = {
      interaction_type: ['You must select an interaction type'],
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
  res.render('interactions/views/details', {
    title: `Interaction with ${res.locals.interaction.company.name}`,
    interactionDetails: getDisplayInteraction(res.locals.interaction),
    interactionLabels: interactionLabels,
    interactionDisplayOrder: interactonDisplayOrder,
  })
}

module.exports = {
  getAddStep1,
  postAddStep1,
  getCommon,
  getInteractionDetails,
}
