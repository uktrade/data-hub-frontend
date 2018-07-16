const { assign } = require('lodash')

const { completeUpload } = require('../repos')

async function postUpload (req, res, next) {
  res.locals.requestBody = req.body

  try {
    await completeUpload(req.session.token, res.locals.requestBody)

    req.flash('success', 'Upload completed')

    if (res.locals.returnLink) {
      return res.redirect(res.locals.returnLink)
    }

    return res.redirect(`/propositions`)
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

module.exports = {
  postUpload,
}
