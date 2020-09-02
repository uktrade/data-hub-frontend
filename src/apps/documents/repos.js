/* eslint-disable camelcase */
const config = require('../../config')
const request = require('request')
const fs = require('fs')

const { authorisedRequest } = require('../../lib/authorised-request')

async function chainUploadSequence(req, data) {
  const documentUploadData = await getDocumentUploadS3Url(req, data)
  const s3Url = documentUploadData.signed_upload_url

  uploadDocumentToS3(req, data, s3Url, documentUploadData.id)
}

function buildApiUrl(url, fields) {
  const app = url.app ? `/${url.app}/${fields[url.app]}` : ''
  const subApp = url.subApp ? `/${url.subApp}/${fields[url.subApp]}` : ''
  const document = url.document ? `/${url.document}` : '/document'

  return `${config.apiRoot}/v3${app}${subApp}${document}`
}

function createRequest(req, urls, file) {
  request(
    {
      url: urls.s3Url,
      method: 'PUT',
      body: fs.readFileSync(file.path),
    },
    (error, response) => {
      if (!error && response.statusCode === 200) {
        authorisedRequest(req, {
          url: urls.api,
          method: 'POST',
        })
      }
    }
  )
}

function getDocumentUploadS3Url(req, { file, url, fields, textFields = {} }) {
  const body = {
    ...textFields,
    original_filename: file.name,
  }

  const options = {
    body,
    url: buildApiUrl(url, fields),
    method: 'POST',
  }

  return authorisedRequest(req, options)
}

function uploadDocumentToS3(req, { url, fields, file }, s3Url, documentId) {
  const api = `${buildApiUrl(url, fields)}/${documentId}/upload-callback`
  const urls = { s3Url, api }

  createRequest(req, urls, file)
}

module.exports = {
  chainUploadSequence,
  getDocumentUploadS3Url,
}
