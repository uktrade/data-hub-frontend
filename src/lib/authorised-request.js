const { isNil, isString, pickBy, set } = require('lodash')
const request = require('request')
const requestPromise = require('request-promise')

const config = require('../../config')
const logger = require('../../config/logger')

function hasValue (value) {
  return !isNil(value)
}

function stripScript (text) {
  const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
  while (SCRIPT_REGEX.test(text)) {
    logger.warn('Found script tag in response')
    text = text.replace(SCRIPT_REGEX, '')
  }
  return text
}

// Called for each key value in a json response, strips out any script tags.
function jsonReviver (key, value) {
  if (isString(value)) {
    return stripScript(value)
  }
  return value
}

function parseOptions (opts) {
  if (isString(opts)) {
    return {
      json: true,
      method: 'GET',
      url: opts,
    }
  }
  return {
    body: opts.body,
    headers: pickBy(opts.headers, hasValue),
    json: true,
    method: opts.method || 'GET',
    url: opts.url,
    ...pickBy(opts.qs, hasValue),
  }
}

// Accepts either options in a kashmap or a string with a url
// Combines the options or url with the given token to create a
// call to the API server
// Responses are parsed to remove any embedded XSS attempts with
// script tags
function authorisedRequest (token, opts) {
  let requestOptions = (isString(opts))
    ? {
      json: true,
      method: 'GET',
      url: opts,
    }
    : {
      body: opts.body,
      headers: pickBy(opts.headers, hasValue),
      json: true,
      method: opts.method || 'GET',
      qs: pickBy(opts.qs, hasValue),
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

  requestOptions = pickBy(requestOptions, hasValue)

  logger.debug('Send authorised request: ', requestOptions)
  requestOptions.jsonReviver = jsonReviver

  return requestPromise(requestOptions)
}

// Accepts either options in a kashmap or a string with a url
// Combines the options or url with the given token to create a
// call to the API server
// Responses are parsed to remove any embedded XSS attempts with
// script tags
function authorisedRawRequest (token, opts) {
  let requestOptions = parseOptions(opts)

  if (process.env.PROXY) {
    requestOptions.proxy = process.env.PROXY
    if (config.isDev) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    }
  }

  if (token) {
    set(requestOptions, 'headers.Authorization', `Bearer ${token}`)
  }

  logger.debug('Send authorised raw request: ', requestOptions)

  return Promise.resolve(request(requestOptions))
}

module.exports = { authorisedRequest, authorisedRawRequest }
