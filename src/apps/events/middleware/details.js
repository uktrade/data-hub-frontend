// TODO: Get rid of this whole module
const { assign } = require('lodash')

const { transformEventFormBodyToApiRequest } = require('../transformers')
const { fetchEvent, saveEvent } = require('../repos')

async function postDetails(req, res, next) {
  res.locals.requestBody = transformEventFormBodyToApiRequest(req.body)

  try {
    const result = await saveEvent(req, res.locals.requestBody)

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

// TODO: Get rid of this
async function getEventDetails(req, res, next, eventId) {
  try {
    res.locals.event = await fetchEvent(req, eventId)
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getEventDetails,
  postDetails,
}
