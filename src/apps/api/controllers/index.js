const { postcodeLookupHandler } = require('./postcode-lookup')
const { postcodeToRegionLookupHandler } = require('./postcode-to-region-lookup')
const { getOptionsHandler } = require('./options')
const { getAdviserOptionsHandler } = require('./advisers')

module.exports = {
  getOptionsHandler,
  getAdviserOptionsHandler,
  postcodeLookupHandler,
  postcodeToRegionLookupHandler,
}
