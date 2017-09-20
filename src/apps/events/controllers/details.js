const { fetchEvent } = require('../repos')
const { transformEventResponseToViewRecord } = require('../transformers')

async function renderDetailsPage (req, res, next) {
  try {
    const event = await fetchEvent(req.session.token, req.params.id)
    const eventViewRecord = transformEventResponseToViewRecord(event)

    res
      .breadcrumb(event.name)
      .render('events/views/details', {
        eventViewRecord,
        eventId: req.params.id,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderDetailsPage,
}
