/* eslint camelcase: 0 */
const { assign, merge, get, pickBy } = require('lodash')

const { eventFormConfig } = require('../macros')
const { transformEventResponseToFormBody } = require('../transformers')
const { buildFormWithStateAndErrors } = require('../../builders')
const { getAdvisers } = require('../../adviser/repos')
const { filterActiveAdvisers } = require('../../adviser/filters')

async function renderEditPage (req, res, next) {
  try {
    const eventData = transformEventResponseToFormBody(res.locals.event)

    const currentAdviser = get(eventData, 'organiser.id')
    const advisers = await getAdvisers(req.session.token)
    const activeAdvisers = filterActiveAdvisers({ advisers: advisers.results, includeAdviser: currentAdviser })

    const eventId = get(eventData, 'id', '')
    const eventName = get(eventData, 'name')
    const lead_team = eventData.lead_team || get(req, 'session.user.dit_team.id')
    const mergedData = pickBy(merge({}, eventData, { lead_team }, res.locals.requestBody))

    const eventForm =
      buildFormWithStateAndErrors(
        eventFormConfig({ eventId, advisers: activeAdvisers }),
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
