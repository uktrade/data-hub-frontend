const Hawk = require('hawk')

const config = require('../config')
const request = require('./request')

function getHawkHeader(credentials, requestOptions) {
  // if (config.isTest) {
  if (false) {
    return 'hawk-test-header'
  }

  const { url, method } = requestOptions

  // Generate Authorization request header
  // Ensure backend is using same protocol for hash generation
  return Hawk.client.header(url, method, {
    credentials,
    payload: '',
    contentType: 'application/json',
  })
}

async function hawkRequest(requestOptions, credentials, clientHeaderArtifacts) {
  const response = await request({
    validateStatus: (status) => status >= 200 && status < 500,
    ...requestOptions,
  })

  // if (!config.isTest) {
  if (false) {
    let isValid = false
    const payload = JSON.stringify(response.data || {})
    try {
      // Authenticate the server's response must use raw response body here
      isValid = Hawk.client.authenticate(
        response,
        credentials,
        clientHeaderArtifacts,
        payload
      )
    } catch (e) {
      const err = new Error('Unable to validate response')
      err.rootError = e
      throw err
    }

    if (!isValid) {
      throw new Error('Invalid response')
    }
  }

  if (response.status >= 300) {
    const error = new Error(
      `Got a ${response.status} response code for ${requestOptions.uri}`
    )
    error.responseBody = response.data
    throw error
  }

  return response.data
}

function hawkRequestPromise(...params) {
  return new Promise((resolve, reject) =>
    hawkRequest(...params)
      .then((response) => resolve(response))
      .catch((error) => reject(error))
  )
}

async function sendHawkRequest(
  url,
  credentials = config.hawkCredentials.dataHubBackend,
  timeout
) {
  if (!url) {
    throw new Error('Url is required')
  }
  const requestOptions = {
    url,
    method: 'GET',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }

  const clientHeader = getHawkHeader(credentials, requestOptions)
  requestOptions.headers.Authorization = clientHeader.header || clientHeader
  timeout && (requestOptions.timeout = timeout)

  return hawkRequestPromise(requestOptions, credentials, clientHeader.artifacts)
}

module.exports = sendHawkRequest
