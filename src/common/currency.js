const { isNumber } = require('lodash')
const { CURRENCY_RATE_USD_TO_GBP } = require('./constants')

const convertUSDToGBP = (usd) => {
  if (!isNumber(usd)) {
    return usd
  }

  const gbp = usd * CURRENCY_RATE_USD_TO_GBP

  if (usd === 1) {
    return gbp
  }

  return gbp ? Math.round(gbp) : gbp
}

module.exports = {
  convertUSDToGBP,
}
