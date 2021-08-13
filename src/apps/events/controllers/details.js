function renderDetailsPage({ params: { eventId } }, res) {
  res.breadcrumb(res.locals.event.name).render('events/views/details', {
    props: {
      eventId,
    },
  })
}

module.exports = {
  renderDetailsPage,
}
