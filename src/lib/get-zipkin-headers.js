const { pickBy } = require('lodash')

const ZIPKIN_HEADERS = ['x-b3-traceid', 'x-b3-spanid']

function getZipkinHeaders(req) {
  return pickBy(req.headers, (header) => header.toLowerCase() in ZIPKIN_HEADERS)
}

module.exports = getZipkinHeaders
