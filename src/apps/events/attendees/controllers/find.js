async function renderFindAttendee(req, res, next) {
  try {
    const event = res.locals.event
    res
      .breadcrumb(event.name, `/events/${event.id}/attendees`)
      .render('events/attendees/views/find', {
        props: {
          eventId: event.id,
        },
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderFindAttendee,
}
