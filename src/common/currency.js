const { isNumber } = require('lodash')
const { currencyRate } = require('../config')

const convertUSDToGBP = (usd) => {
  if (!isNumber(usd)) {
    return usd
  }

  const gbp = usd * currencyRate.usdToGbp

  if (usd === 1) {
    return gbp
  }

  return gbp ? Math.round(gbp) : gbp
}

module.exports = {
  convertUSDToGBP,
}
