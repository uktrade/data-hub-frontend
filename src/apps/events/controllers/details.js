const renderDetailsPage = ({ params: { eventId } }, res, next) => {
  try {
    const { event } = res.locals

    const flashMessages = res.locals.getMessages()

    res.locals.title = `Event name - ${event.name} - Events`

    res.render('events/views/details', { props: { eventId, flashMessages } })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderDetailsPage,
}
