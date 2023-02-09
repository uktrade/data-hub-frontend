/**
 * This is the original rp version of hawk request. This should be deprecated
 * but seems more stable.
 */
const request = require('request')
const Hawk = require('hawk')
const config = require('../config')

const HTTP_OK = 200

function getHawkHeader(credentials, requestOptions) {
  if (config.isTest) {
    return 'hawk-test-header'
  }

  const { uri, method } = requestOptions

  // Generate Authorization request header
  // Ensure backend is using same protocol for hash generation
  return Hawk.client.header(uri, method, {
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
  return new Promise((resolve, reject) => {
    request(requestOptions, (err, response, responseBody) => {
      if (err || response?.statusCode !== HTTP_OK) {
        return reject(new Error(err))
      }
      if (!config.isTest) {
        let isValid = false
        try {
          // Authenticate the server's response must use raw response body here
          isValid = Hawk.client.authenticate(
            response,
            credentials,
            clientHeaderArtifacts,
            { payload: responseBody }
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
      const body = JSON.parse(responseBody)

      const statusCode = response.statusCode
      if (statusCode >= 200 && statusCode < 300) {
        return resolve(body)
      }
      const error = new Error(
        `Got a ${statusCode} response code for ${requestOptions.uri}`
      )
      error.responseBody = body

      return reject(error)
    })
  })
}

async function sendHawkRequest(
  uri,
  credentials = config.hawkCredentials.dataHubBackend
) {
  if (!uri) {
    throw new Error('Uri is required')
  }
  const requestOptions = {
    uri,
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
