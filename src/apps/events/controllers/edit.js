function renderEventPage (req, res) {
  res
    .breadcrumb('Add event')
    .render('events/views/edit', {
      title: 'Add event',
    })
}

module.exports = {
  renderEventPage,
}
