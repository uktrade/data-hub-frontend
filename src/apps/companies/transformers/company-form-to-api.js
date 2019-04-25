const { castArray, omit } = require('lodash')

const unitedKingdomId = '80756b9a-5d95-e211-a939-e4115bead28a'

const ADDRESS_TYPE = {
  address: 1,
  registered: 2,
}

const transformAddress = (requestBody, addressType, isUkCompany) => {
  const prefix = addressType === ADDRESS_TYPE.address ? '' : 'registered_'

  const hasMinimalAddressFields =
    requestBody[`${prefix}address_1`] &&
    requestBody[`${prefix}address_town`] &&
    requestBody[`${prefix}address_country`]

  if (addressType === ADDRESS_TYPE.address || hasMinimalAddressFields) {
    return {
      line_1: requestBody[`${prefix}address_1`],
      line_2: requestBody[`${prefix}address_2`] || '',
      town: requestBody[`${prefix}address_town`],
      county: requestBody[`${prefix}address_county`] || '',
      postcode: requestBody[`${prefix}address_postcode`] || '',
      country: isUkCompany && requestBody[`${prefix}address_1`] ? unitedKingdomId : requestBody[`${prefix}address_country`],
    }
  }
}

module.exports = (requestBody, isUkCompany) => {
  const transformed = {
    ...omit(requestBody, [
      'companies_house_data',
      'contacts',
      'interactions',
      'address_1',
      'address_2',
      'address_town',
      'address_county',
      'address_postcode',
      'address_country',
      'registered_address_1',
      'registered_address_2',
      'registered_address_town',
      'registered_address_county',
      'registered_address_postcode',
      'registered_address_country',
    ]),
    trading_names: requestBody.trading_names ? castArray(requestBody.trading_names) : [],
    address: transformAddress(requestBody, ADDRESS_TYPE.address, isUkCompany),
    registered_address: transformAddress(requestBody, ADDRESS_TYPE.registered, isUkCompany),
  }

  if (requestBody.headquarter_type === 'not_headquarters') {
    transformed.headquarter_type = ''
  }

  return transformed
}
