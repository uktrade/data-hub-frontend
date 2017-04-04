/* eslint new-cap: 0 */
const express = require('express')
const moment = require('moment')

const router = express.Router()
/**
 *
 *  HTTP Get call to get a list of interactions for a company
 *  Gets a list of interactions associated with a company
 *  Furthermore the controller extracts only the fields required and pre-formats them to make layout easier.
 */
function getInteractions (req, res) {
  res.locals.tab = 'interactions'
  const company = res.locals.company

  // build the data for the interaction list.
  res.locals.interactions = company.interactions.map((interaction) => {
    const type = (interaction.interaction_type.name === 'Service delivery') ? 'servicedelivery' : 'interaction'

    return {
      url: `/${type}/${interaction.id}/details`,
      type: interaction.interaction_type.name,
      subject: interaction.subject,
      date: moment(interaction.date).format('DD MMMM YYYY'),
      advisor: `${interaction.dit_advisor.first_name} ${interaction.dit_advisor.last_name}`
    }
  })

  // Only allow a link to add an interaction if the company has contacts
  if (company.contacts && company.contacts.length > 0) {
    res.locals.addInteractionUrl = `/interaction/add?company=${company.id}`
  }

  res.render('company/interactions')
}

router.get('/company/:source/:sourceId/interactions', getInteractions)

module.exports = { getInteractions, router }
