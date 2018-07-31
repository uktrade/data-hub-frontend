/* eslint-disable camelcase */
const { assign } = require('lodash')
const formidable = require('formidable')
const map = require('lodash/map')

const { getDocumentUploadS3Url, uploadDocumentToS3 } = require('../repos')

class DocumentUpload {
  async chainUploadSequence (req, res, filesData, index) {
    const s3_options = await getDocumentUploadS3Url(req.session.token, filesData)
    const temporary_path = filesData.file.path
    const s3_url = s3_options.signed_upload_url

    try {
      uploadDocumentToS3(s3_url, temporary_path, req, res, s3_options.id, filesData.investment_project, index)
    } catch (error) {
      res.status(error.statusCode).json({ message: error.message })
    }
  }
}

function parseForm (req, res) {
  const form = new formidable.IncomingForm()

  form.maxFileSize = 5000 * 1024 * 1024 // 5GB
  form.parse(req, (err, fields, files) => {
    map(files, async (file, value, index) => { // TODO(jf) "index" isn't an index
      const filesData = {
        id: fields.id,
        investment_project: fields.investment_project,
        file,
      }
      if (!file.name.length) { return }

      const documentUpload = new DocumentUpload()
      await documentUpload.chainUploadSequence(req, res, filesData, file, index)
    })

    if (err) {
      return res.status(500).json({ error: err })
    }
  })
}

function postUpload (req, res, next) {
  try {
    parseForm(req, res)
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
