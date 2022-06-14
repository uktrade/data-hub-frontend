const renderEventsView = async (req, res, next) => {
  console.log('render events view ')
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
  renderEventsView,
}
