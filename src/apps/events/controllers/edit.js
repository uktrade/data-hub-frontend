const { eventFormConfig } = require('../macros')
const { getAdvisers } = require('../../adviser/repos')
const { transformObjectToOption } = require('../../transformers')
const { buildFormWithState } = require('../../builders')
const { get, castArray, compact } = require('lodash')

async function renderEventPage (req, res, next) {
  try {
    const advisersResponse = await getAdvisers(req.session.token)
    const advisers = advisersResponse.results.map(transformObjectToOption)
    const eventForm = eventFormConfig(advisers)
    const emptyDate = { year: '', month: '', day: '' }
    const body = Object.assign(req.body, {
      event_start_date: emptyDate,
      event_end_date: emptyDate,
      event_team_hosting: get(req, 'session.user.dit_team.id', null),
    })
    const eventFormWithState = buildFormWithState(eventForm, body)

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

function postHandler (req, res, next) {
  const setAddAnotherField = (value) => compact(castArray(value))
  req.body.event_shared_teams = setAddAnotherField(req.body.event_shared_teams)
  req.body.event_programmes = setAddAnotherField(req.body.event_programmes)

  if (req.body.add_event_shared_team || req.body.add_event_programme) {
    return next()
  }
}

module.exports = {
  renderEventPage,
  postHandler,
}
