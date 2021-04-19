const hawk = require('@hapi/hawk')
const config = require('../config')
const request = require('./request')

function getHawkHeader(credentials, requestOptions) {
  if (config.isTest) {
    return { header: 'hawk-test-header' }
  }

  const { url, method } = requestOptions

  // Generate Authorization request header
  // Ensure backend is using same protocol for hash generation
  return hawk.client.header(url, method, {
    credentials,
    payload: '',
    contentType: '',
  })
}

function createPromiseRequest(
  requestOptions,
  credentials,
  clientHeaderArtifacts
) {
  return new Promise((resolve, reject) =>
    request(requestOptions)
      .then((response) => {
        if (!config.isTest) {
          let isValid = false
          try {
            // Authenticate the server's response must use raw response body here
            isValid = hawk.client.authenticate(
              response,
              credentials,
              clientHeaderArtifacts,
              { payload: JSON.stringify(response.data || {}) }
            )
          } catch (e) {
            const err = new Error('Unable to validate response')
            err.rootError = e
            return reject(err)
          }

          if (!isValid) {
            return reject(new Error('Invalid response'))
          }
        }

        const body = response.data

        const statusCode = response.status
        if (statusCode >= 200 && statusCode < 300) {
          return resolve(body)
        }
        const error = new Error(
          `Got a ${statusCode} response code for ${requestOptions.uri}`
        )
        error.responseBody = body

        return reject(error)
      })
      .catch((error) => reject(new Error(error)))
  )
}

async function sendHawkRequest(
  uri,
  credentials = config.hawkCredentials.dataHubBackend
) {
  if (!uri) {
    throw new Error('Uri is required')
  }
  const requestOptions = {
    url: uri,
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  }

  const clientHeader = getHawkHeader(credentials, requestOptions)
  requestOptions.headers.Authorization = clientHeader.header

  return createPromiseRequest(
    requestOptions,
    credentials,
    clientHeader.artifacts
  )
}

module.exports = sendHawkRequest
