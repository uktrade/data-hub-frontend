const config = require('../../../config')
const authorisedRequest = require('../../lib/authorised-request')
const { search } = require('../search/services')

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

async function getActiveEvents (token, createdOn) {
  const eventsResponse = await search({
    searchEntity: 'event',
    requestBody: {
      sortby: 'name:asc',
      disabled_on: {
        after: createdOn || (new Date()).toISOString(),
        exists: false,
      },
    },
    token: token,
    limit: 100000,
    isAggregation: false,
  })

  return eventsResponse.results
}

async function fetchEventAttendees (token, eventId, page = 1) {
  const limit = 10
  const offset = limit * (page - 1)

  const eventAttendees = await authorisedRequest(token, {
    url: `${config.apiRoot}/v3/interaction`,
    qs: {
      limit,
      offset,
      event_id: eventId,
      sortby: 'contact__last_name,contact__first_name',
    },
  })

  return eventAttendees
}

module.exports = {
  saveEvent,
  fetchEvent,
  getEvents,
  getAllEvents,
  getActiveEvents,
  fetchEventAttendees,
}
