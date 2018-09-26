const { isPresent, pickBy, set } = require('lodash')
const request = require('request-promise')

const config = require('../../config')
const logger = require('../../config/logger')

function stripScript (text) {
  const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
  while (SCRIPT_REGEX.test(text)) {
    logger.warn('Found script tag in response')
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
  let requestOptions = (isString(opts))
    ? {
      json: true,
      method: 'GET',
      url: opts,
    }
    : {
      body: opts.body,
      headers: pickBy(opts.headers, isPresent), // remove empty headers
      json: true,
      method: opts.method || 'GET',
      qs: pickBy(opts.qs, isPresent), // remove empty params
      url: opts.url,
    }

  if (process.env.PROXY) {
    requestOptions.proxy = process.env.PROXY
    if (config.isDev) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    }
  }

  if (token) {
    set(requestOptions, 'headers.Authorization', `Bearer ${token}`)
  }

  // Strip out top level properties that are null (such as qs)
  requestOptions = pickBy(requestOptions, isPresent)

  logger.debug('Send authorised request: ', requestOptions)
  requestOptions.jsonReviver = jsonReviver

  return request(requestOptions)
}
