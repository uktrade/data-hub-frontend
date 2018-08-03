/* eslint-disable camelcase */
const { assign } = require('lodash')
const request = require('request')
const fs = require('fs')
const formidable = require('formidable')
const map = require('lodash/map')

const config = require('../../../../config')
const authorisedRequest = require('../../../lib/authorised-request')

function getDocumentUploadS3Url (req, res, self) {
  const url = `${self.documentUpload.getParentUrl(self)}/document`
  const options = {
    url,
    method: 'POST',
    body: {
      original_filename: self.file.name,
    },
  }

  return authorisedRequest(req.session.token, options)
}

function uploadDocumentToS3 (req, res, self, url, id) {
  const returnUrl = `${req.baseUrl}/propositions/${req.params.propositionId}/`
  const apiUrl = `${self.documentUpload.getParentUrl(req, res, self)}/document/${id}/upload-callback`

  self.documentUpload.createRequest(req, res, self, url, id, apiUrl, returnUrl)
}

class DocumentUpload {
  async chainUploadSequence (req, res, self) {
    try {
      const s3_options = await getDocumentUploadS3Url(req, res, self)
      const s3_url = s3_options.signed_upload_url

      uploadDocumentToS3(req, res, self, s3_url, s3_options.id)
    } catch (error) {
      res.status(error.statusCode).json({ message: error.message })
    }
  }

  getParentUrl (req, res, self) {
    // TODO (jf): these two urls should get params from outside the module
    return `${config.apiRoot}/v3/investment/${self.parent_id}/proposition/${self.id}`
  }

  createRequest (req, res, self, url, id, apiUrl, returnUrl) {
    request({
      url,
      method: 'PUT',
      body: fs.readFileSync(self.file.path),
    }, (error, response) => {
      if (!error && response.statusCode === 200) {
        try {
          authorisedRequest(req.session.token, {
            url: apiUrl,
            method: 'POST',
          })

          if (self.index === self.numberOfDocuments) {
            req.flash('success', `${self.numberOfDocuments} File(s) uploaded`)
            res.redirect(returnUrl)
          }
        } catch (error) {
          req.flash('error', error.message)
          res.redirect(req.originalUrl)
        }
      }
    })
  }
}

function countDocumentsUploaded (collection) {
  let index = 0

  map(collection, (item) => {
    if (item.size || item.name.length) {
      index++
    }
  })

  return index
}

function parseForm (req, res) {
  const form = new formidable.IncomingForm()

  form.maxFileSize = 5000 * 1024 * 1024 // 5GB
  form.parse(req, (err, fields, files) => {
    let index = 0

    map(files, async (file, value, collection) => {
      const self = {
        id: fields.id,
        parent_id: fields.investment_project, // TODO(jf) this needs to be dynamic
        file,
        numberOfDocuments: countDocumentsUploaded(collection),
      }

      if (!file.name.length) { return }

      index++
      self.index = index
      self.documentUpload = new DocumentUpload()
      await self.documentUpload.chainUploadSequence(req, res, self)
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
