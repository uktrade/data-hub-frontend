/* eslint-disable camelcase */
const { assign, filter, map } = require('lodash')
const formidable = require('formidable')

const { chainUploadSequence } = require('../repos')

function parseForm (req, res, apiConfig) {
  const form = new formidable.IncomingForm()

  form.maxFileSize = 5000 * 1024 * 1024 // 5GB

  form.parse(req, async (err, fields, files) => {
    let index = 0

    if (apiConfig.collectTextFields) {
      await apiConfig.collectTextFields(req, res, fields)
    }

    map(files, async (file, value, collection) => {
      res.locals.documents = {
        id: fields.id,
        parent_id: fields[fields.app],
        file,
        numberOfDocuments: filter(collection, (document) => document.name.length).length,
        fields,
        url: apiConfig.url,
      }

      if (!file.name.length) { return }
      index++
      await chainUploadSequence(req, res, index)
    })

    if (err) {
      return res.status(500).json({ error: err })
    }
  })
}

function postUpload (req, res, next) {
  const apiConfig = this

  try {
    parseForm(req, res, apiConfig)
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
