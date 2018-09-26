// authorised-raw-request is based on authorised-request
// using request instead of request-promise, for use with streams[1]
// [1] https://github.com/request/request-promise/issues/90

const { isPresent, isString, pickBy, set } = require('lodash')
const request = require('request')

const config = require('../../config')
const logger = require('../../config/logger')

// Accepts either options in a kashmap or a string with a url
// Combines the options or url with the given token to create a
// call to the API server
// The response is not parsed
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

  logger.debug('Send authorised raw request: ', requestOptions)

  const req = request(requestOptions)
  return Promise.resolve(req)
}
