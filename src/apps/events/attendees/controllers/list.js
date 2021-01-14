const { merge, omit } = require('lodash')

const {
  transformApiResponseToCollection,
} = require('../../../../modules/api/transformers')
const { fetchEventAttendees } = require('../repos')
const {
  transformServiceDeliveryToAttendeeListItem,
} = require('../transformers')
const { attendeeSortForm, defaultAttendeeSort } = require('../macros')

async function renderAttendees(req, res, next) {
  try {
    const event = res.locals.event

    const name = event.name
    const query = req.query
    const page = query.page || 1
    const sortby = req.query.sortby || defaultAttendeeSort
    const incompleteEvent = !event.service || !event.lead_team

    const attendeesResponse = await fetchEventAttendees({
      req,
      eventId: event.id,
      page,
      sortby,
    })

    const attendeesCollection = transformApiResponseToCollection(
      { query },
      transformServiceDeliveryToAttendeeListItem
    )(attendeesResponse)

    attendeesCollection.countLabel = 'attendee'

    if (!incompleteEvent && !event.disabled_on) {
      attendeesCollection.actionButtons = [
        {
          label: 'Add attendee',
          url: `/events/${event.id}/attendees/find-new`,
        },
      ]
    }

    attendeesCollection.sortForm = merge({}, attendeeSortForm, {
      action: `/events/${event.id}/attendees`,
      hiddenFields: omit(req.query, 'sortby'),
      children: [{ value: sortby }],
    })

    res.breadcrumb(name).render('events/attendees/views/list', {
      incompleteEvent,
      attendees: attendeesCollection,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderAttendees,
}
