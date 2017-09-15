const { eventFormConfig } = require('../macros')
const { getAdvisers } = require('../../adviser/repos')
const { transformObjectToOption } = require('../../transformers')
const { buildFormWithState } = require('../../builders')
const { get } = require('lodash')

async function renderEventPage (req, res, next) {
  try {
    const advisersResponse = await getAdvisers(req.session.token)
    const advisers = advisersResponse.results.map(transformObjectToOption)
    const eventForm = eventFormConfig(advisers)
    const emptyDate = { year: '', month: '', day: '' }
    const body = Object.assign(req.body, {
      start_date: emptyDate,
      end_date: emptyDate,
      lead_team: get(req, 'session.user.dit_team.id', null),
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
  if (get(res.locals, 'form.errors')) {
    return next()
  }

  req.flash('success', 'Event created')
  return res.redirect(`/events/${res.locals.resultId}/details`)
}

module.exports = {
  renderEventPage,
  postHandler,
}
