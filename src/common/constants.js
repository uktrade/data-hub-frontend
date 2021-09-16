// https://www.bloomberg.com/quote/USDGBP:CUR
const EXCHANGE_RATE_USD_TO_GBP = 0.7231
const EXCHANGE_RATE_GBP_TO_USD = parseFloat(
  Number(1 / EXCHANGE_RATE_USD_TO_GBP).toFixed(4)
)

// These are date-fns format codes - see https://date-fns.org/v2.23.0/docs/format
const DATE_LONG_FORMAT_1 = 'd MMMM yyyy'
const DATE_LONG_FORMAT_2 = 'dd MMM yyyy'
const DATE_LONG_FORMAT_3 = 'yyyy-MM-dd'
const DATE_DAY_LONG_FORMAT = 'E, dd MMM yyyy'
const DATE_MEDIUM_FORMAT = 'd MMM yyyy'
const DATE_TIME_MEDIUM_FORMAT = 'd MMM yyyy, h:mmaaa'
const DATE_SHORT_FORMAT = 'yyyy-MM'
const INTERACTION_TIMESTAMP_FORMAT = 'y-MM-d'

const UNITED_KINGDOM_ID = '80756b9a-5d95-e211-a939-e4115bead28a'
const UNITED_STATES_ID = '81756b9a-5d95-e211-a939-e4115bead28a'
const CANADA_ID = '5daf72a6-5d95-e211-a939-e4115bead28a'

module.exports = {
  EXCHANGE_RATE_USD_TO_GBP,
  EXCHANGE_RATE_GBP_TO_USD,
  DATE_DAY_LONG_FORMAT,
  DATE_LONG_FORMAT_1,
  DATE_LONG_FORMAT_2,
  DATE_LONG_FORMAT_3,
  DATE_MEDIUM_FORMAT,
  DATE_TIME_MEDIUM_FORMAT,
  DATE_SHORT_FORMAT,
  INTERACTION_TIMESTAMP_FORMAT,
  UNITED_KINGDOM_ID,
  UNITED_STATES_ID,
  CANADA_ID,
}
