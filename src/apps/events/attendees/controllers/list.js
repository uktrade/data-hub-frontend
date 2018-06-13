const { get } = require('lodash')

const { transformApiResponseToCollection } = require('../../../transformers')
const { fetchEventAttendees } = require('../repos')
const { transformServiceDeliveryToAttendeeListItem } = require('../transformers')

async function renderAttendees (req, res, next) {
  try {
    const eventId = get(res.locals, 'event.id')

    if (!eventId) {
      return next()
    }

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
      .render('events/attendees/views/list', {
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
