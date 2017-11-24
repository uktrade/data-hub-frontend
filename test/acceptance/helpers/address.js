const { title } = require('case')

/**
 *
 * @param address1
 * @param address2
 * @param town
 * @param county
 * @param postcode
 * @param country
 * @returns {string}
 */

// FIXME - note use of title is because of its use in /src/lib/address.js this needs reviewing
function getAddress ({ address1, address2, town, county, postcode, country }) {
  return [
    title(address1),
    title(address2),
    title(town),
    title(county),
    postcode,
    title(country),
  ].filter(details => details)
    .join(', ')
    .trim()
    .replace(/\s+/g, ' ')
}

module.exports = {
  getAddress,
}
