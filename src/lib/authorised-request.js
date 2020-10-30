const { isNil, isString, pickBy } = require('lodash')
const axios = require('axios')

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

function parseConfig(req, opts) {
  const { token } = req.session
  const defaults = {
    headers: {
      ...opts.headers,
      ...getZipkinHeaders(req),
      ...(token ? { Authorization: `Bearer ${token}` } : null),
    },
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
    data: opts.body,
    method: opts.method || 'GET',
    params: pickBy(opts.qs, hasValue),
    url: opts.url,
  }
}

function createResponseLogger(requestOpts) {
  return (res) => {
    const statusCode = (res && res.data && res.data.statusCode) || ''
    const responseInfo = `Response ${statusCode} for ${requestOpts.method} to ${requestOpts.url}:`
    logger.debug(responseInfo, res.data)
    return res.data
  }
}

function logRequest(opts) {
  logger.debug(`Sending ${opts.method} to ${opts.url}`)
  logger.debug('with request data:', {
    headers: opts.headers,
    body: opts.body,
    // TO DO - DECIDE: should this be params: opts.params, or will this make a mess of log history?
    qs: opts.params,
  })
}

// Accepts options as keys on an object or encoded as a url
// Responses are parsed to remove any embedded XSS attempts with
// script tags
function authorisedRequest(req, opts) {
  const requestConfig = parseConfig(req, opts)

  logRequest(requestConfig)
  requestConfig.jsonReviver = stripScripts

  const r = axios(requestConfig)

  const logResponse = createResponseLogger(requestConfig)
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
  const requestConfig = parseConfig(req, opts)
  logRequest(requestConfig)

  // return Promise.resolve(request(requestConfig))
  return axios(requestConfig)
}

// accept untrusted certificates for dev environments
if (config.isDev && config.proxy) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

module.exports = {
  authorisedRequest,
  authorisedRawRequest,
}
