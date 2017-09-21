const { displayEventLabels } = require('../labels')

function renderDetailsPage (req, res) {
  res
    .breadcrumb(res.locals.event.name)
    .render('events/views/details', {
      displayEventLabels,
    })
}

module.exports = {
  renderDetailsPage,
}
