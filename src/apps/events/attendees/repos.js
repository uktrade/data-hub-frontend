const { isNil, pickBy } = require('lodash')

const config = require('../../../config')
const { authorisedRequest } = require('../../../lib/authorised-request')

async function fetchEventAttendees({
  req,
  eventId,
  page = 1,
  sortby,
  limit = 20,
  contactId,
}) {
  if (!eventId) {
    return null
  }

  const offset = limit * (page - 1)

  const eventAttendees = await authorisedRequest(req, {
    url: `${config.apiRoot}/v3/interaction`,
    qs: pickBy(
      {
        limit,
        offset,
        sortby,
        event_id: eventId,
        contacts__id: contactId,
      },
      (value) => !isNil(value)
    ),
  }).then((result) => {
    return Object.assign(result, {
      limit: limit,
    })
  })
  return eventAttendees
}

module.exports = {
  fetchEventAttendees,
}
