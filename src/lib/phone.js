/**
 * Extracts and formats a phone number from a contact.
 *
 * @param {string} countryCode A string or null representing a telephone country code
 * @param {string} telephoneNumber A string or null representing a telephone number
 * @returns {string} formatted phone number
 */
function formatPhone (countryCode, telephoneNumber) {
  if (countryCode && countryCode.length === 0) {
    countryCode = null
  }

  if (!countryCode) {
    return telephoneNumber
  }

  if (countryCode && telephoneNumber && telephoneNumber.charAt(0) === '0') {
    return `${countryCode} ${telephoneNumber.substr(1)}`
  }

  if (countryCode && telephoneNumber && telephoneNumber.charAt(0) !== '0') {
    return `${countryCode} ${telephoneNumber}`
  }
}

module.exports = { formatPhone }
