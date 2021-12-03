const renderReactifiedEventsView = async (req, res, next) => {
  try {
    const { user } = req.session
    const currentAdviserId = user.id

    const props = {
      title: 'Events',
      heading: 'Events',
      currentAdviserId,
    }

    return res.render('events/views/events', { props })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderReactifiedEventsView,
}
