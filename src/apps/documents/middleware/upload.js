/* eslint-disable camelcase */
const { filter } = require('lodash')
const formidable = require('formidable')

const { chainUploadSequence } = require('../repos')

function parseForm(req, res) {
  const form = new formidable.IncomingForm()
  const fiveGigabytes = 5000 * 1024 * 1024

  form.maxFileSize = fiveGigabytes

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: err })
    }

    Object.keys(files).map(async (key, index, collection) => {
      try {
        await chainUploadSequence(req, {
          fields,
          file: files[key],
          url: res.locals.documents.url,
          textFields: getTextFields(res.locals.documents, fields),
        })
      } catch (e) {
        req.flash('error', e.message)
        res.redirect(res.locals.ORIGINAL_URL)
      }

      if (collection.length === index + 1) {
        req.flash('success', `${filter(files).length} File(s) uploaded`)
        res.redirect(res.locals.returnLink)
      }
    })
  })
}

function getTextFields({ collectTextFields = () => {} }, fields) {
  return collectTextFields(fields)
}

function postUpload(req, res, next) {
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
