/* eslint-disable camelcase */
const config = require('../../../config')
const request = require('request')
const fs = require('fs')

const authorisedRequest = require('../../lib/authorised-request')

async function chainUploadSequence (req, res, index) {
  try {
    const s3_options = await getDocumentUploadS3Url(req, res, index)
    const s3_url = s3_options.signed_upload_url

    uploadDocumentToS3(req, res, index, s3_url, s3_options.id)
  } catch (error) {
    res.status(error.statusCode).json({ message: error.message })
  }
}

function buildApiUrl (res) {
  const { url, fields } = res.locals.documents
  const app = url.app ? `/${url.app}/${fields[url.app]}` : ''
  const subApp = url.subApp ? `/${url.subApp}/${fields[url.subApp]}` : ''
  const document = url.document ? `/${url.document}` : '/document'

  return `${config.apiRoot}/v3${app}${subApp}${document}`
}

function createRequest (req, res, index, urls) {
  const self = res.locals.documents

  request({
    url: urls.s3,
    method: 'PUT',
    body: fs.readFileSync(self.file.path),
  }, (error, response) => {
    if (!error && response.statusCode === 200) {
      try {
        authorisedRequest(req.session.token, {
          url: urls.api,
          method: 'POST',
        })

        if (index === self.numberOfDocuments) {
          req.flash('success', `${self.numberOfDocuments} File(s) uploaded`)
          res.redirect(res.locals.returnLink)
        }
      } catch (error) {
        req.flash('error', error.message)
        res.redirect(req.originalUrl)
      }
    }
  })
}

function getDocumentUploadS3Url (req, res, index) {
  const url = buildApiUrl(res)

 const requestBody = index === 1 ? res.locals.requestBody : {}
  const body = {
    ...requestBody,
    original_filename: res.locals.documents.file.name,
  }

  const options = {
    url,
    body,
    method: 'POST',
  }

  return authorisedRequest(req.session.token, options)
}

function uploadDocumentToS3 (req, res, index, s3, id) {
  const api = `${buildApiUrl(res)}/${id}/upload-callback`
  const urls = { s3, api }

  createRequest(req, res, index, urls)
}

module.exports = {
  chainUploadSequence,
  getDocumentUploadS3Url,
}
