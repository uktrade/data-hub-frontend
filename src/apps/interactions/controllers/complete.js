const { get } = require('lodash')

const { meetingHappenForm } = require('../macros/index')
const { buildFormWithStateAndErrors } = require('../../builders')

function getReturnLink (interactions, interactionId) {
  const prefix = get(interactions, 'returnLink', 'interactions/')

  return `${prefix}${interactionId}`
}

function renderCompletePage (req, res) {
  const {
    interactions,
    interaction,
    userAgent,
    errors,
  } = res.locals
  
  const form = meetingHappenForm({
    userAgent,
    returnLink: getReturnLink(interactions, interaction.id),
  })

  return res
    .breadcrumb('Interaction')
    .title('Did the meeting take place?')
    .render('interactions/views/complete', {
      meetingHappenForm: buildFormWithStateAndErrors(form, req.body, errors),
    })
}

module.exports = {
  renderCompletePage,
}
