const request = require('request-promise')
const winston = require('winston')

function stripScript (text) {
  const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
  while (SCRIPT_REGEX.test(text)) {
    winston.warn('Found script tag in response')
    text = text.replace(SCRIPT_REGEX, '')
  }
  return text
}

function isString (s) {
  return typeof (s) === 'string' || s instanceof String
}

// Called for each key value in a json response, strips out any script tags.
function jsonReviver (key, value) {
  if (isString(value)) {
    return stripScript(value)
  }
  return value
}

// Accepts either options in a kashmap or a string with a url
// Combines the options or url with the given token to create a
// call to the API server
// Responses are parsed to remove any embedded XSS attempts with
// script tags
module.exports = (token, opts) => {
  const requestOptions = {
    json: true
  }

  if (isString(opts)) {
    requestOptions.url = opts
    requestOptions.method = 'GET'
    requestOptions.headers = {}
  } else {
    requestOptions.url = opts.url
    requestOptions.headers = opts.headers || {}
    requestOptions.method = opts.method || 'GET'

    if (opts.body) {
      requestOptions.body = opts.body
    }
  }

  if (requestOptions.url.indexOf('v2') !== -1) {
    requestOptions.headers = { 'content-type': 'application/vnd.api+json', 'accept': 'application/vnd.api+json' }
  }

  if (process.env.PROXY) {
    requestOptions.proxy = process.env.PROXY
  }

  if (token) {
    requestOptions.headers.Authorization = `Bearer ${token}`
  }

  winston.debug('Send authorised request: ', requestOptions)
  requestOptions.jsonReviver = jsonReviver

  return request(requestOptions)
}
