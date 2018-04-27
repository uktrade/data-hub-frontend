const { postcodeLookupHandler } = require('./postcode-lookup')
const { getOptionsHandler } = require('./options')
const { getEntityOptionsHandler } = require('./entity')

module.exports = {
  getOptionsHandler,
  postcodeLookupHandler,
  getEntityOptionsHandler,
}
