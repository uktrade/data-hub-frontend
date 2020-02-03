const { addMinutes, isAfter } = require('date-fns')
const moment = require('moment')

const { DATE_TIME_MEDIUM_FORMAT } = require('../../../src/common/constants')

module.exports = {
  isEuropeanOrGlobalHeadquartersFormatter(expected, actual) {
    const formatted = /^(european|global) headquarters$/i.test(expected)
      ? 'Yes'
      : 'No'
    return formatted === actual
  },
  isProjectCodeFormatter(expected, actual) {
    return /^DHP-[0-9]{8}$/i.test(actual)
  },
  isRecentDateFormatter(expected, actual) {
    const actualDate = moment(actual, DATE_TIME_MEDIUM_FORMAT).toDate()
    const oneMinuteAgo = addMinutes(actualDate, -1)

    return isAfter(actualDate, oneMinuteAgo)
  },
}
