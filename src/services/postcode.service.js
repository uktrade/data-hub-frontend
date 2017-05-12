const rp = require('request-promise')
const config = require('../config')

function lookupAddress (postcode) {
  return new Promise((resolve, reject) => {
    let formattedPostcode = tidyPostcode(postcode)

    let baseUrl = config.postcodeLookup.baseUrl
    let postcodeKey = config.postcodeLookup.apiKey
    let url = baseUrl.replace('{postcode}', formattedPostcode).replace('{api-key}', postcodeKey)

    rp({ url, json: true })
      .then((data) => {
        let parsed = parsePostcodeResult(data, postcode.toLocaleUpperCase())
        resolve(parsed)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

function tidyPostcode (postcode) {
  return postcode.replace(/\s+/g, '').toLocaleLowerCase()
}

function parsePostcodeResult (data, postcode) {
  if (!data || !data.Addresses) {
    return null
  }

  return data.Addresses.map((address) => {
    let split = address.split(',')
    let parsedAddress = {}
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
  lookupAddress
}
