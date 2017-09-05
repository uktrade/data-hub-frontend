const { eventForm } = require('../macros')
const { getAdvisers } = require('../../adviser/repos')
const { transformObjectToOption } = require('../../transformers')

async function renderEventPage (req, res, next) {
  try {
    const advisersResponse = await getAdvisers(req.session.token)
    const advisers = advisersResponse.results.map(transformObjectToOption)

    res
      .breadcrumb('Add event')
      .render('events/views/edit', {
        title: 'Add event',
        eventForm: eventForm(advisers),
      })
  } catch (e) {
    next(e)
  }
}

module.exports = {
  renderEventPage,
}
