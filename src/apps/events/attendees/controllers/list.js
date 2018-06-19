const { transformApiResponseToCollection } = require('../../../transformers')
const { fetchEventAttendees } = require('../repos')
const { transformServiceDeliveryToAttendeeListItem } = require('../transformers')

async function renderAttendees (req, res, next) {
  try {
    const event = res.locals.event

    if (!event) {
      throw new Error('Missing event')
    }

    const name = event.name
    const query = req.query
    const page = query.page || 1
    const token = req.session.token

    const attendees = await fetchEventAttendees(token, event.id, page)
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
          actionButtons: [{
            label: 'Add attendee',
            url: `/events/${event.id}/attendees/find-new`,
          }],
        },
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderAttendees,
}
