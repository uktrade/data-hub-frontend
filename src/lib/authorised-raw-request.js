const { isNil, isString, pickBy, set } = require('lodash')
const request = require('request')

const config = require('../../config')
const logger = require('../../config/logger')

function hasValue (value) {
  return !isNil(value)
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
// The response is not parsed
module.exports = (token, opts) => {
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
