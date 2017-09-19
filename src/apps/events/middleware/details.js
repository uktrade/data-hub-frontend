const { transformToApi } = require('../services/formatting')
const { createEvent } = require('../repos')
const { assign, castArray, compact } = require('lodash')

async function handleFormPost (req, res, next) {
  const castToArrayAndRemoveEmpty = (value) => compact(castArray(value))
  req.body.teams = castToArrayAndRemoveEmpty(req.body.teams)
  req.body.related_programmes = castToArrayAndRemoveEmpty(req.body.related_programmes)

  if (req.body.add_team || req.body.add_related_programme) {
    return next()
  }

  const formattedBody = transformToApi(assign({}, req.body))

  try {
    const result = await createEvent(req.session.token, formattedBody)

    res.locals.resultId = result.id

    next()
  } catch (err) {
    if (err.statusCode === 400) {
      res.locals.form = assign({}, res.locals.form, {
        state: req.body,
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

module.exports = {
  handleFormPost,
}
