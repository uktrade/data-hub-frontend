/* eslint camelcase: 0 */
const { eventFormConfig } = require('../macros')
const { transformEventResponseToFormBody } = require('../transformers')
const { buildFormWithStateAndErrors } = require('../../builders')
const { assign, merge, get, pickBy } = require('lodash')

function renderEditPage (req, res) {
  const eventData = transformEventResponseToFormBody(res.locals.event)
  const advisers = get(res.locals, 'advisers')
  const eventId = get(eventData, 'id', '')
  const eventName = get(eventData, 'name')
  const lead_team = eventData.lead_team || get(req, 'session.user.dit_team.id')
  const mergedData = pickBy(merge({}, eventData, { lead_team }, res.locals.requestBody))
  const eventForm =
    buildFormWithStateAndErrors(
      eventFormConfig({ eventId, advisers }),
      mergedData,
      get(res.locals, 'form.errors.messages'),
    )

  res
    .breadcrumb(eventName, `/events/${eventId}`)
    .breadcrumb(`${eventId ? 'Edit' : 'Add'} event`)
    .render('events/views/edit', {
      eventForm: assign(eventForm, {
        returnLink: `/events/${eventId}`,
        returnText: 'Cancel',
      }),
    })
}

module.exports = {
  renderEditPage,
}
