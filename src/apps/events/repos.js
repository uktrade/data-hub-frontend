const config = require('../../../config')
const authorisedRequest = require('../../lib/authorised-request')
const { search } = require('../search/services')
const { filterDisabledOption } = require('../filters')

function saveEvent (token, event) {
  const options = {
    url: `${config.apiRoot}/v3/event`,
    method: 'POST',
    body: event,
  }

  if (event.id) {
    options.url = `${options.url}/${event.id}`
    options.method = 'PATCH'
  }

  return authorisedRequest(token, options)
}

function fetchEvent (token, id) {
  return authorisedRequest(token, `${config.apiRoot}/v3/event/${id}`)
}

function getEvents (token) {
  return authorisedRequest(token, `${config.apiRoot}/v3/event`)
}

function getAllEvents (token) {
  return authorisedRequest(token, `${config.apiRoot}/v3/event?limit=100000&offset=0`)
}

/**
 *
 * @param {string} token Session token to use for API requests
 * @param {string} currentEventId The id for an event that must be included in the list irrigardless of if is disabled or not (the current value)
 *
 * @returns {promise[Array]} Returns an array of event objects that have not been disabled or are the current event
 */
async function getActiveEvents (token, currentEventId) {
  const eventsResponse = await search({
    searchEntity: 'event',
    requestBody: { sortby: 'name:asc' },
    token: token,
    limit: 100000,
    isAggregation: false,
  })

  return eventsResponse.results.filter(filterDisabledOption(currentEventId))
}

module.exports = {
  saveEvent,
  fetchEvent,
  getEvents,
  getAllEvents,
  getActiveEvents,
}
