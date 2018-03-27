const { postcodeLookupHandler } = require('./postcode-lookup')
const { getOptionsHandler } = require('./options')
const { getAdviserOptionsHandler } = require('./advisers')

module.exports = {
  getOptionsHandler,
  getAdviserOptionsHandler,
  postcodeLookupHandler,
}
