/* eslint-disable camelcase */
const { filter } = require('lodash')
const formidable = require('formidable')

const { chainUploadSequence } = require('../repos')

function parseForm (req, res) {
  const form = new formidable.IncomingForm()
  const fiveGigabytes = 5000 * 1024 * 1024

  form.maxFileSize = fiveGigabytes

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: err })
    }

    files.forEach(async (file, value, collection) => {
      try {
        await chainUploadSequence(req.session.token, {
          file,
          fields,
          url: res.locals.documents.url,
        })
      } catch (e) {
        req.flash('error', e.message)
        res.redirect(req.originalUrl)
      }
    })

    req.flash('success', `${filter(files).length} File(s) uploaded`)
    res.redirect(res.locals.returnLink)
  })
}

function postUpload (req, res, next) {
  try {
    parseForm(req, res)
  } catch (error) {
    if (error.statusCode !== 400) {
      return next(error)
    }
  }
}

module.exports = {
  postUpload,
}
