async function renderPage (req, res) {
  res
    .breadcrumb('Event details')
    .render('events/views/details', {
      title: 'Event details',
    })
}

module.exports = {
  renderPage,
}
