/* eslint-disable camelcase */
const { get, compact, pickBy } = require('lodash')

const transformAddress = (company, prefix) => {
  const addressParts = compact([
    get(company, `${prefix}address_1`),
    get(company, `${prefix}address_2`),
    get(company, `${prefix}address_town`),
    get(company, `${prefix}address_county`),
    get(company, `${prefix}address_postcode`),
    get(company, `${prefix}address_country.name`),
  ])

  if (addressParts.length) {
    return addressParts
  }
}

function transformMetaItem (value) {
  return {
    value,
    label: 'Type',
    type: 'badge',
  }
}

module.exports = (company) => {
  const registeredAddress = transformAddress(company, 'registered_')
  const tradingAddress = transformAddress(company, 'trading_')

  const viewRecord = {
    registered: {
      address: registeredAddress,
      meta: compact([
        tradingAddress ? null : transformMetaItem('Trading'),
        transformMetaItem('Registered'),
      ]),
    },
    trading: tradingAddress ? {
      address: tradingAddress,
      meta: [
        transformMetaItem('Trading'),
      ],
    } : null,
  }

  return pickBy(viewRecord)
}
