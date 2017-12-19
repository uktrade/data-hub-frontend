/* eslint camelcase: 0 */
const { assign, merge, get, pickBy } = require('lodash')

const { eventFormConfig } = require('../macros')
const { transformEventResponseToFormBody } = require('../transformers')
const { buildFormWithStateAndErrors } = require('../../builders')
const { getAdvisers } = require('../../adviser/repos')
const { filterActiveAdvisers } = require('../../adviser/filters')
const { getOptions } = require('../../../lib/options')
const { transformObjectToOption } = require('../../transformers')

async function getEditOptions (token, createdOn, currentAdviser) {
  const advisers = await getAdvisers(token)
  const activeAdvisers = filterActiveAdvisers({
    advisers: advisers.results,
    includeAdviser: currentAdviser,
  })

  return {
    advisers: activeAdvisers.map(transformObjectToOption),
    eventTypes: await getOptions(token, 'event-type', { createdOn }),
    locationTypes: await getOptions(token, 'location-type', { createdOn }),
    countries: await getOptions(token, 'country', { createdOn }),
    teams: await getOptions(token, 'team', { createdOn }),
    services: await getOptions(token, 'service', { createdOn }),
    programmes: await getOptions(token, 'programme', { createdOn }),
    ukRegions: await getOptions(token, 'uk-region', { createdOn }),
  }
}

async function renderEditPage (req, res, next) {
  try {
    const eventData = transformEventResponseToFormBody(res.locals.event)

    const eventId = get(eventData, 'id', '')
    const eventName = get(eventData, 'name')
    const lead_team = eventData.lead_team || get(req, 'session.user.dit_team.id')
    const mergedData = pickBy(merge({}, eventData, { lead_team }, res.locals.requestBody))

    const currentAdviser = get(eventData, 'organiser.id')
    const options = await getEditOptions(req.session.token, mergedData.created_on, currentAdviser)

    const eventForm =
      buildFormWithStateAndErrors(
        eventFormConfig(assign({}, { eventId }, options)),
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
