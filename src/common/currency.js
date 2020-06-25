const { isNumber } = require('lodash')
const {
  EXCHANGE_RATE_USD_TO_GBP,
  EXCHANGE_RATE_GBP_TO_USD,
} = require('./constants')

const convertUsdToGbp = (usd) => {
  if (!isNumber(usd)) {
    return usd
  }

  return usd * EXCHANGE_RATE_USD_TO_GBP
}

const convertGbpToUsd = (gbp) => {
  if (!isNumber(gbp)) {
    return gbp
  }

  return gbp * EXCHANGE_RATE_GBP_TO_USD
}

module.exports = {
  convertUsdToGbp,
  convertGbpToUsd,
}
