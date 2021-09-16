const renderDetailsPage = ({ params: { eventId } }, res, next) => {
  try {
    const { event } = res.locals

    res.locals.title = `Event name - ${event.name} - DIT Data Hub`

    res.render('events/views/details', { props: { eventId } })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderDetailsPage,
}
