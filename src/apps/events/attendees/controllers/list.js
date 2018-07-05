const { merge, omit } = require('lodash')

const { transformApiResponseToCollection } = require('../../../transformers')
const { fetchEventAttendees } = require('../repos')
const { transformServiceDeliveryToAttendeeListItem } = require('../transformers')
const { attendeeSortForm, defaultAttendeeSort } = require('../macros')

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
    const sortby = req.query.sortby || defaultAttendeeSort

    const sortForm = merge({}, attendeeSortForm, {
      hiddenFields: omit(req.query, 'sortby'),
      children: [
        { value: sortby },
      ],
    })

    const attendees = await fetchEventAttendees(token, event.id, page, sortby)
      .then(transformApiResponseToCollection(
        { query },
        transformServiceDeliveryToAttendeeListItem
      ))

    res
      .breadcrumb(name)
      .render('events/attendees/views/list', {
        attendees: {
          sortForm,
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
