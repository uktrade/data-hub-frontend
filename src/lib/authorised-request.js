const { isNil, isString, pickBy } = require('lodash')
const request = require('./request')

const config = require('../config')
const logger = require('../config/logger')
const getZipkinHeaders = require('./get-zipkin-headers')

function hasValue(value) {
  return !isNil(value)
}

function parseConfig(req, opts) {
  const { token } = req.session
  const { responseType = 'json' } = opts
  const defaults = {
    headers: {
      ...(responseType == 'json' ? { 'Content-Type': 'application/json' } : {}),
      ...opts.headers,
      ...getZipkinHeaders(req),
      ...(token ? { Authorization: `Bearer ${token}` } : null),
    },
    responseType,
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
  return ({ statusCode = '', ...data }) => {
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
    params: opts.params,
  })
}

// Accepts options as keys on an object or encoded as a url and transforms data
async function authorisedRequest(req, opts) {
  const requestConfig = parseConfig(req, opts)

  logRequest(requestConfig)

  const logResponse = createResponseLogger(requestConfig)
  try {
    const { data } = await request(requestConfig)
    logResponse(data)
    return data
  } catch (err) {
    logResponse(err)
    throw err
  }
}

// Accepts options as keys on an object or encoded as a url
function authorisedRawRequest(req, opts) {
  const requestConfig = parseConfig(req, opts)
  logRequest(requestConfig)

  return request(requestConfig)
}

// accept untrusted certificates for dev environments
if (config.isDev && config.proxy) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

module.exports = {
  authorisedRequest,
  authorisedRawRequest,
}
