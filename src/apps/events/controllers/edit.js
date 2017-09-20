const { eventFormConfig } = require('../macros')
const { getAdvisers } = require('../../adviser/repos')
const { transformObjectToOption } = require('../../transformers')
const { buildFormWithStateAndErrors } = require('../../builders')
const { assign, get } = require('lodash')

async function renderEventPage (req, res, next) {
  try {
    const advisersResponse = await getAdvisers(req.session.token)
    const advisers = advisersResponse.results.map(transformObjectToOption)
    const emptyDate = { year: '', month: '', day: '' }
    const body = assign({}, req.body, {
      start_date: emptyDate,
      end_date: emptyDate,
      lead_team: get(req, 'session.user.dit_team.id', null),
    })
    const eventForm =
      buildFormWithStateAndErrors(
        eventFormConfig(advisers),
        body,
        get(res.locals, 'form.errors.messages')
      )

    res
      .breadcrumb('Add event')
      .render('events/views/edit', {
        title: 'Add event',
        eventForm,
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
