/* eslint new-cap: 0 */
const express = require('express')
const {getDisplayCompanyInteraction} = require('../services/interactionformattingservice')

const router = express.Router()
/**
 *
 *  HTTP Get call to get a list of interactions for a company
 *  Gets a list of interactions associated with a company
 *  Furthermore the controller extracts only the fields required and pre-formats them to make layout easier.
 */
function getInteractions (req, res) {
  res.locals.tab = 'interactions'

  res.locals.interactions = res.locals.company.interactions.map(interaction => getDisplayCompanyInteraction(interaction))

  // Only allow a link to add an interaction if the company has contacts
  const company = res.locals.company
  if (company.contacts && company.contacts.length > 0) {
    res.locals.addInteractionUrl = `/interaction/add?company=${company.id}`
  }

  res.render('company/interactions')
}

router.get('/company/:source/:sourceId/interactions', getInteractions)

module.exports = { getInteractions, router }
