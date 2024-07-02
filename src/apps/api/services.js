const { trim } = require('lodash')

const request = require('../../lib/request')
const config = require('../../config')

function lookupAddress(postcode) {
  return new Promise((resolve, reject) => {
    const formattedPostcode = tidyPostcode(postcode)

    const baseUrl = config.postcodeLookup.baseUrl
    const postcodeKey = config.postcodeLookup.apiKey
    const url = baseUrl
      .replace('{postcode}', formattedPostcode)
      .replace('{api-key}', postcodeKey)

    request(url)
      .then(({ data }) => {
        const parsed = parsePostcodeResult(data, postcode.toLocaleUpperCase())
        resolve(parsed)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

function tidyPostcode(postcode) {
  return postcode.replace(/\s+/g, '').toLocaleLowerCase()
}

function parsePostcodeResult(data, postcode) {
  if (!data || !data.Addresses) {
    return null
  }

  return data.Addresses.map((address) => {
    const split = address.split(',').map((result) => trim(result))
    const parsedAddress = {}
    if (split[5].trim().length > 0) {
      parsedAddress.county = split[6]
      parsedAddress.city = split[5]
    } else {
      parsedAddress.city = split[6]
    }
    if (split[2].trim().length > 0) {
      parsedAddress.address1 = split[0] + ' - ' + split[1]
      parsedAddress.address2 = split[2]
    } else {
      parsedAddress.address1 = split[0]
      parsedAddress.address2 = split[1]
    }
    parsedAddress.postcode = postcode
    return parsedAddress
  })
}

module.exports = {
  lookupAddress,
}
