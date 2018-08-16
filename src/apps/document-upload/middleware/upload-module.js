/* eslint-disable camelcase */
const { assign } = require('lodash')
const request = require('request')
const fs = require('fs')
const formidable = require('formidable')
const map = require('lodash/map')

const config = require('../../../../config')
const authorisedRequest = require('../../../lib/authorised-request')

function getDocumentUploadS3Url (req, res, self) {
  const url = `${self.documentUpload.buildApiUrl(self)}`
  const body = {
    original_filename: self.file.name,
    ...res.locals.requestBody,
  }

  const options = {
    url,
    method: 'POST',
    body,
  }

  return authorisedRequest(req.session.token, options)
}

function uploadDocumentToS3 (req, res, self, url, id) {
  const returnUrl = `${req.baseUrl}/propositions/${req.params.propositionId}/`
  const apiUrl = `${self.documentUpload.buildApiUrl(self)}/${id}/upload-callback`

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

  buildApiUrl (self) {
    const app = self.url.app ? `/${self.url.app}/${self.fields[self.url.app]}` : ''
    const subApp = self.url.subApp ? `/${self.url.subApp}/${self.fields[self.url.subApp]}` : ''
    const document = self.url.document ? `/${self.url.document}` : '/document'

    return `${config.apiRoot}/v3${app}${subApp}${document}`
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

function parseForm (req, res, apiConfig) {
  const form = new formidable.IncomingForm()

  form.maxFileSize = 5000 * 1024 * 1024 // 5GB

  form.parse(req, (err, fields, files) => {
    let index = 0

    map(files, async (file, value, collection) => {

      const self = {
        id: fields.id,
        parent_id: fields[fields.app],
        file,
        numberOfDocuments: countDocumentsUploaded(collection),
        fields,
        url: apiConfig.url,
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
