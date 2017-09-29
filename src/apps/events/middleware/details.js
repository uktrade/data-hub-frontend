const { assign } = require('lodash')

const { fetchEvent } = require('../repos')
const { transformEventResponseToViewRecord, transformEventFormBodyToApiRequest } = require('../transformers')
const { saveEvent } = require('../repos')

async function postDetails (req, res, next) {
  res.locals.requestBody = transformEventFormBodyToApiRequest(req.body)

  if (req.body.add_team || req.body.add_related_programme) {
    return next()
  }

  try {
    const result = await saveEvent(req.session.token, res.locals.requestBody)

    if (!res.locals.event) {
      req.flash('success', 'Event created')
    }
    return res.redirect(`/events/${result.id}`)
  } catch (err) {
    if (err.statusCode === 400) {
      res.locals.form = assign({}, res.locals.form, {
        errors: {
          messages: err.error,
        },
      })
      next()
    } else {
      next(err)
    }
  }
}

async function getEventDetails (req, res, next, eventId) {
  try {
    res.locals.event = await fetchEvent(req.session.token, eventId)
    res.locals.eventViewRecord = transformEventResponseToViewRecord(res.locals.event)
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  postDetails,
  getEventDetails,
}
