const { assign } = require('lodash')

const {
  transformEventResponseToViewRecord,
  transformEventFormBodyToApiRequest,
} = require('../transformers')
const { fetchEvent, saveEvent } = require('../repos')

async function postDetails(req, res, next) {
  const featureFlags = res.locals.features
  res.locals.requestBody = transformEventFormBodyToApiRequest(
    req.body,
    featureFlags
  )

  try {
    const result = await saveEvent(req, res.locals.requestBody, featureFlags)

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

async function getEventDetails(req, res, next, eventId) {
  try {
    res.locals.event = await fetchEvent(req, eventId)
    res.locals.eventViewRecord = transformEventResponseToViewRecord(
      res.locals.event
    )
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getEventDetails,
  postDetails,
}
