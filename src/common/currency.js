const { isNumber } = require('lodash')
const { EXCHANGE_RATE_USD_TO_GBP } = require('./constants')

const convertUsdToGbp = (usd) => {
  if (!isNumber(usd)) {
    return usd
  }

  return usd * EXCHANGE_RATE_USD_TO_GBP
}

module.exports = {
  convertUsdToGbp,
}
