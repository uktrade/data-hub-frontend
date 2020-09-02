const { isNil, isString, pickBy } = require('lodash')
const request = require('request')
const requestPromise = require('request-promise')

const config = require('../config')
const logger = require('../config/logger')
const getZipkinHeaders = require('./get-zipkin-headers')

function hasValue(value) {
  return !isNil(value)
}

function stripScript(text) {
  const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
  while (SCRIPT_REGEX.test(text)) {
    logger.warn('Found script tag in response')
    text = text.replace(SCRIPT_REGEX, '')
  }
  return text
}

function stripScripts(key, value) {
  if (isString(value)) {
    return stripScript(value)
  }
  return value
}

function parseOptions(req, opts) {
  const { token } = req.session
  const defaults = {
    headers: {
      ...opts.headers,
      ...getZipkinHeaders(req),
      ...(token ? { Authorization: `Bearer ${token}` } : null),
    },
    json: true,
    method: 'GET',
    proxy: config.proxy,
  }

  if (isString(opts)) {
    return {
      ...defaults,
      url: opts,
    }
  }

  return {
    ...defaults,
    body: opts.body,
    method: opts.method || 'GET',
    qs: pickBy(opts.qs, hasValue),
    url: opts.url,
  }
}

function createResponseLogger(requestOpts) {
  return (data) => {
    const statusCode = (data && data.statusCode) || ''
    const responseInfo = `Response ${statusCode} for ${requestOpts.method} to ${requestOpts.url}:`
    logger.debug(responseInfo, data)
    return data
  }
}

function logRequest(opts) {
  logger.debug(`Sending ${opts.method} to ${opts.url}`)
  logger.debug('with request data:', {
    headers: opts.headers,
    body: opts.body,
    qs: opts.qs,
  })
}

// Accepts options as keys on an object or encoded as a url
// Responses are parsed to remove any embedded XSS attempts with
// script tags
function authorisedRequest(req, opts) {
  const requestOptions = parseOptions(req, opts)

  logRequest(requestOptions)
  requestOptions.jsonReviver = stripScripts

  const r = requestPromise(requestOptions)

  const logResponse = createResponseLogger(requestOptions)
  return r.then(logResponse, (err) => {
    logResponse(err)
    throw err
  })
}

// Accepts options as keys on an object or encoded as a url
// Responses are not parsed for XSS attacks
// See request-promise #90 does not work with streams
// https://github.com/request/request-promise/issues/90
function authorisedRawRequest(req, opts) {
  const requestOptions = parseOptions(req, opts)

  logRequest(requestOptions)

  return Promise.resolve(request(requestOptions))
}

// accept untrusted certificates for dev environments
if (config.isDev && config.proxy) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

module.exports = {
  authorisedRequest,
  authorisedRawRequest,
}
