const { eventForm } = require('../macros')

function renderEventPage (req, res) {
  res
    .breadcrumb('Add event')
    .render('events/views/edit', {
      title: 'Add event',
      eventForm,
    })
}

module.exports = {
  renderEventPage,
}
