const config = require('../../../../config')
const authorisedRequest = require('../../../lib/authorised-request')

async function fetchEventAttendees ({ token, eventId, page = 1, sortby, limit = 10 }) {
  if (!eventId) {
    return null
  }

  const offset = limit * (page - 1)

  const eventAttendees = await authorisedRequest(token, {
    url: `${config.apiRoot}/v3/interaction`,
    qs: {
      limit,
      offset,
      sortby,
      event_id: eventId,
    },
  })

  return eventAttendees
}

module.exports = {
  fetchEventAttendees,
}
