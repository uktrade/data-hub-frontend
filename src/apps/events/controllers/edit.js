/* eslint camelcase: 0 */
const { eventFormConfig } = require('../macros')
const { transformEventResponseToFormBody } = require('../transformers')
const { buildFormWithStateAndErrors } = require('../../builders')
const { assign, merge, get, pickBy } = require('lodash')
const { getAdvisers } = require('../../adviser/repos')
const { filterDisabledOption } = require('../../filters')

async function getActiveAdvisers (token, currentAdviser) {
  const allAdvisers = await getAdvisers(token)
  return allAdvisers.results.filter(filterDisabledOption(currentAdviser))
}

async function renderEditPage (req, res, next) {
  try {
    const eventData = transformEventResponseToFormBody(res.locals.event)
    const advisers = await getActiveAdvisers(req.session.token, get(eventData, 'organiser.id'))
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
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderEditPage,
}
