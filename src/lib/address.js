const { get, compact } = require('lodash')

// TODO align all addresses across the app to use the same format
function getFormattedAddress (entity, key) {
  const prefix = key ? `${key}_` : ''

  const addressParts = compact([
    get(entity, `${prefix}address_1`),
    get(entity, `${prefix}address_2`),
    get(entity, `${prefix}address_town`),
    get(entity, `${prefix}address_county`),
    get(entity, `${prefix}address_postcode`),
    get(entity, `${prefix}address_country.name`),
  ])

  return addressParts.length ? addressParts.join(', ') : null
}

module.exports = {
  getFormattedAddress,
}
