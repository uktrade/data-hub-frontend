const { transformToApi } = require('../services/formatting')
const { createEvent } = require('../repos')

async function handleFormPost (req, res, next) {
  const formattedBody = transformToApi(Object.assign({}, req.body))

  try {
    const result = await createEvent(req.session.token, formattedBody)

    res.locals.resultId = result.id

    next()
  } catch (err) {
    if (err.statusCode === 400) {
      res.locals.form = Object.assign({}, res.locals.form, {
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
