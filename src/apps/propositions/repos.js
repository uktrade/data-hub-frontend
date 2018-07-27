const request = require('request')
const fs = require('fs')

const config = require('../../../config')
const authorisedRequest = require('../../lib/authorised-request')

function fetchProposition (token, propositionId, investmentId) {
  return authorisedRequest(token, `${config.apiRoot}/v3/investment/${investmentId}/proposition/${propositionId}`)
}

function saveProposition (token, proposition) {
  const options = {
    url: `${config.apiRoot}/v3/investment/${proposition.investment_project}/proposition`,
    method: 'POST',
    body: proposition,
  }

  if (proposition.id) {
    options.url = `${options.url}/${proposition.id}`
    options.method = 'PATCH'
  }

  return authorisedRequest(token, options)
}

function abandonProposition (token, proposition) {
  const options = {
    url: `${config.apiRoot}/v3/investment/${proposition.investment_project}/proposition/${proposition.id}/abandon`,
    method: 'POST',
    body: proposition,
  }

  return authorisedRequest(token, options)
}

function completeProposition (token, proposition) {
  const options = {
    url: `${config.apiRoot}/v3/investment/${proposition.investment_project}/proposition/${proposition.id}/complete`,
    method: 'POST',
    body: proposition,
  }

  return authorisedRequest(token, options)
}

function getDocumentUploadS3Url (token, local) {
  const options = {
    url: `${config.apiRoot}/v3/investment/${local.investment_project}/proposition/${local.id}/document`,
    method: 'POST',
    body: {
      filename: local.file.name,
    },
  }

  return authorisedRequest(token, options)
}

class PutDocument {
  createRequest (req, res, url, filePath, apiUrl, returnUrl, index) {
    request({
      url,
      method: 'PUT',
      body: fs.readFileSync(filePath),
    }, (error, response) => {
      if (!error && response.statusCode === 200) {
        try {
          authorisedRequest(req.session.token, {
            url: apiUrl,
            method: 'POST',
            body: {
              status: 'success',
            },
          })

          // if (index !== 0) {
          //   req.flash('success', `File(s) uploaded`)
          //   res.redirect(returnUrl)
          // }
        } catch (error) {
          req.flash('error', error.message)
          res.redirect(req.originalUrl)
        }
      }
    })
  }
}

function uploadDocumentToS3 (url, filePath, req, res, id, investmentProject, index) {
  const returnUrl = `${req.baseUrl}/propositions/${req.params.propositionId}/`
  const apiUrl = `${config.apiRoot}/v3/investment/${investmentProject}/proposition/${req.params.propositionId}/document/${id}/upload-callback`

  console.log(']]]]]]]]]]]] filePath ]]]]]]]]]]]]]], ', filePath)

  const putDocument = new PutDocument()
  putDocument.createRequest(req, res, url, filePath, apiUrl, returnUrl, index)

}

/**
 * Get propositions for a investment
 *
 * @param {string} token
 * @param {string} investmentId
 * @param {number} page
 * @return {Promise<Object[]>} Returns a promise that resolves to an array of API proposition objects
 */
function getPropositionsForInvestment (token, investmentId, page) {
  const limit = 10
  const offset = limit * (page - 1)
  return authorisedRequest(token, `${config.apiRoot}/v3/investment/${investmentId}/proposition?&limit=${limit}&offset=${offset}`)
}

module.exports = {
  abandonProposition,
  completeProposition,
  getDocumentUploadS3Url,
  saveProposition,
  fetchProposition,
  getPropositionsForInvestment,
  uploadDocumentToS3,
}
