const { assign, get } = require('lodash')

const { transformEventResponseToViewRecord, transformEventFormBodyToApiRequest } = require('../transformers')
const { fetchEvent, saveEvent } = require('../repos')
const { getAdvisers } = require('../../adviser/repos')

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
  } catch (err) {
    next(err)
  }
}

async function setActiveAdvisers (req, res, next) {
  try {
    const currentAdviser = get(req.locals, 'event.adviser.id')
    res.locals.advisers = await getAdvisers(req.session.token, { includeDisabled: false, currentAdviser })
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getEventDetails,
  setActiveAdvisers,
  postDetails,
}
