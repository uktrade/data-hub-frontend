const { pickBy } = require('lodash')

const ZIPKIN_HEADERS = ['x-b3-traceid', 'x-b3-spanid']

function getZipkinHeaders(req) {
  return pickBy(req.headers, (value, header) =>
    ZIPKIN_HEADERS.includes(header.toLowerCase())
  )
}

module.exports = getZipkinHeaders
