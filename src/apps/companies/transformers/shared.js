/* eslint-disable camelcase */
const { getFormattedAddress } = require('../../../lib/address')
const { address: addressLabels } = require('../labels')

function transformSicCodes ({
  sic_code_1,
  sic_code_2,
  sic_code_3,
  sic_code_4,
}) {
  return [
    sic_code_1,
    sic_code_2,
    sic_code_3,
    sic_code_4,
  ]
    .filter(item => item.length)
    .join(', ')
}

function getCompanyAddress ({
  trading_address_country,
  trading_address_county,
  trading_address_town,
  trading_address_postcode,
  trading_address_1,
  trading_address_2,
  registered_address_country,
  registered_address_county,
  registered_address_town,
  registered_address_postcode,
  registered_address_1,
  registered_address_2,
}) {
  const isTradingAddress = trading_address_town && trading_address_postcode && trading_address_1

  if (isTradingAddress) {
    return {
      label: addressLabels.companyTradingAddress,
      value: getFormattedAddress({
        address_1: trading_address_1,
        address_2: trading_address_2,
        address_town: trading_address_town,
        address_county: trading_address_county,
        address_postcode: trading_address_postcode,
        address_country: trading_address_country,
      }),
    }
  } else {
    return {
      label: addressLabels.companyRegisteredAddress,
      value: getFormattedAddress({
        address_1: registered_address_1,
        address_2: registered_address_2,
        address_town: registered_address_town,
        address_county: registered_address_county,
        address_postcode: registered_address_postcode,
        address_country: registered_address_country,
      }),
    }
  }
}

module.exports = {
  transformSicCodes,
  getCompanyAddress,
}
