const { get } = require('lodash')

const { transformApiResponseToCollection } = require('../../transformers')
const { fetchEventAttendees } = require('../repos')
const { transformServiceDeliveryToAttendeeListItem } = require('../../interactions/transformers')

async function renderAttendees (req, res, next) {
  try {
    const eventId = req.params.eventId
    const name = get(res.locals, 'event.name')
    const query = req.query
    const page = query.page || 1
    const token = req.session.token

    const attendees = await fetchEventAttendees(token, eventId, page)
      .then(transformApiResponseToCollection(
        { query },
        transformServiceDeliveryToAttendeeListItem
      ))

    res
      .breadcrumb(name)
      .render('events/views/attendees', {
        attendees: {
          ...attendees,
          countLabel: 'attendee',
        },
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderAttendees,
}
