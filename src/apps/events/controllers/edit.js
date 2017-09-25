/* eslint camelcase: 0 */
const { eventFormConfig } = require('../macros')
const { getAdvisers } = require('../../adviser/repos')
const { transformEventResponseToFormBody } = require('../transformers')
const { buildFormWithStateAndErrors } = require('../../builders')
const { assign, merge, get, pickBy } = require('lodash')

async function renderEditPage (req, res, next) {
  const eventData = transformEventResponseToFormBody(res.locals.event)
  const eventId = get(eventData, 'id', '')
  const eventName = get(eventData, 'name')
  const lead_team = eventData.lead_team || get(req, 'session.user.dit_team.id')

  try {
    const advisersResponse = await getAdvisers(req.session.token)
    const advisers = advisersResponse.results
    const mergedData = pickBy(merge({}, eventData, { lead_team }, res.locals.requestBody))

    const eventForm =
      buildFormWithStateAndErrors(
        eventFormConfig({ advisers }),
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
  } catch (e) {
    next(e)
  }
}

module.exports = {
  renderEditPage,
}
