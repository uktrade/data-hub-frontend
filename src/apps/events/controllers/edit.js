/* eslint camelcase: 0 */
const { assign, merge, get, pickBy } = require('lodash')

const { eventFormConfig } = require('../macros')
const { transformEventResponseToFormBody } = require('../transformers')
const { buildFormWithStateAndErrors } = require('../../builders')
const { getAdvisers } = require('../../adviser/repos')
const { filterActiveAdvisers } = require('../../adviser/filters')
const { getOptions } = require('../../../lib/options')
const { transformObjectToOption } = require('../../transformers')

const filterServiceNames = (services) => {
  if (!services) return

  const excludedServiceStrings = [
    'A Specific DIT Export Service or Funding',
    'A Specific Service',
  ]

  const filteredServiceNames = services.map((service) => {
    const splitServiceName = service.label.split(' : ')
    const name =
      splitServiceName[1] &&
      excludedServiceStrings.includes(splitServiceName[0])
        ? splitServiceName[1]
        : service.label
    return { ...service, label: name }
  })

  return filteredServiceNames
}

async function getEditOptions(req, createdOn, currentAdviser) {
  const advisers = await getAdvisers(req)
  const activeAdvisers = filterActiveAdvisers({
    advisers: advisers.results,
    includeAdviser: currentAdviser,
  })

  const unfilteredServiceOptions = await getOptions(req, 'service', {
    createdOn,
    context: 'event',
  })

  return {
    advisers: activeAdvisers.map(transformObjectToOption),
    eventTypes: await getOptions(req, 'event-type', { createdOn }),
    locationTypes: await getOptions(req, 'location-type', { createdOn }),
    countries: await getOptions(req, 'country', { createdOn }),
    teams: await getOptions(req, 'team', { createdOn }),
    services: filterServiceNames(unfilteredServiceOptions),
    programmes: await getOptions(req, 'programme', { createdOn }),
    ukRegions: await getOptions(req, 'uk-region', { createdOn }),
  }
}

async function renderEditPage(req, res, next) {
  try {
    const eventData = transformEventResponseToFormBody(res.locals.event)
    const featureFlags = res.locals.features

    const eventId = get(eventData, 'id', '')
    const eventName = get(eventData, 'name')
    const lead_team =
      eventData.lead_team || get(req, 'session.user.dit_team.id')
    const mergedData = pickBy(
      merge({}, eventData, { lead_team }, res.locals.requestBody)
    )
    const currentAdviser = get(eventData, 'organiser')
    const options = await getEditOptions(
      req,
      mergedData.created_on,
      currentAdviser
    )

    const eventForm = buildFormWithStateAndErrors(
      eventFormConfig(assign({}, { eventId }, options), featureFlags),
      mergedData,
      get(res.locals, 'form.errors.messages')
    )

    if (eventName) {
      res.breadcrumb(eventName, `/events/${eventId}`)
    }

    res
      .breadcrumb(`${eventId ? 'Edit' : 'Add'} event`)
      .render('events/views/edit', {
        eventForm,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderEditPage,
  filterServiceNames,
}
