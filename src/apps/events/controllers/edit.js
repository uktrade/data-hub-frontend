const { eventFormConfig } = require('../macros')
const { getAdvisers } = require('../../adviser/repos')
const { transformObjectToOption } = require('../../transformers')
const { buildFormWithState } = require('../../builders')

async function renderEventPage (req, res, next) {
  try {
    const advisersResponse = await getAdvisers(req.session.token)
    const advisers = advisersResponse.results.map(transformObjectToOption)
    const eventForm = eventFormConfig(advisers)
    const emptyDate = { year: '', month: '', day: '' }
    const requestBody = {
      'event-start-date': emptyDate,
      'event-end-date': emptyDate,
      'event-team-hosting': req.session.user.dit_team.id,
    }
    const eventFormWithState = buildFormWithState(eventForm, requestBody)

    res
      .breadcrumb('Add event')
      .render('events/views/edit', {
        title: 'Add event',
        eventForm: eventFormWithState,
      })
  } catch (e) {
    next(e)
  }
}

module.exports = {
  renderEventPage,
}
