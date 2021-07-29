/**
 * The purpose of this file is so we can have a centralised location for all date transformation functions, instead of having two separate date-util files.
 * This reduces duplication of functions across the codebase as the two pre-existing files contained many identical functions.
 * As these functions are used in both client-side and server-side code, they need to be exported using `module.exports` and imported using `const {} = require()`
 * so they can be used in both CommonJS and ES6 files.
 * Once the React transition is complete, we will be able to convert all these functions to ES6 modules.
 */

const {
  addDays: addDaysFns,
  addMonths: addMonthsFns,
  addYears: addYearsFns,
  differenceInCalendarDays,
  endOfToday,
  endOfYesterday,
  format: formatFns,
  formatDistanceToNowStrict,
  isAfter,
  isValid,
  minutesToHours,
  parse,
  parseISO,
  subDays,
  subMonths,
  subYears,
  subWeeks,
} = require('date-fns')

const {
  DATE_LONG_FORMAT_1,
  DATE_LONG_FORMAT_2,
  DATE_LONG_FORMAT_3,
  DATE_MEDIUM_FORMAT,
  DATE_TIME_MEDIUM_FORMAT,
  DATE_SHORT_FORMAT,
  INTERACTION_TIMESTAMP_FORMAT,
} = require('../../common/constants')

/**
 * Simple wrappers around date-fns and native Date functions
 */
function addYears(date, yearsToAdd) {
  return addYearsFns(date, yearsToAdd)
}

function subtractYears(date, yearsToSubtract) {
  return subYears(date, yearsToSubtract)
}

function addDays(date, daysToAdd) {
  return addDaysFns(date, daysToAdd)
}

function subtractDays(date, daysToSubtract) {
  return subDays(date, daysToSubtract)
}

function isDateAfter(date1, date2) {
  return isAfter(date1, date2)
}

function today() {
  return format(new Date())
}

function addMonths(date, numberOfMonths) {
  return addMonthsFns(date, numberOfMonths)
}
function subtractWeeks(date, numberOfweeks) {
  return subWeeks(date, numberOfweeks)
}

function getYesterday() {
  return endOfYesterday()
}

function subtractMonths(date, numberOfMonths) {
  return subMonths(date, numberOfMonths)
}

function convertMinutesToHours(date) {
  return minutesToHours(date)
}

/**
 * Date validation functions
 */

function isDateValid(date) {
  return isValid(parseISO(date))
}

function isUnparsedDateValid(date) {
  return isValid(date)
}

function isNormalisedDateValid(year, month, day, format = DATE_LONG_FORMAT_3) {
  const date = normaliseAndFormatDate(year, month, day)
  return isValid(parse(date, format, new Date()))
}

function isShortDateValid(year, month) {
  return isNormalisedDateValid(year, month, null, DATE_SHORT_FORMAT)
}

/**
 * Date formatting and parsing functions
 */

function format(dateStr, dateFormat = DATE_LONG_FORMAT_2) {
  return isDateValid(dateStr) ? formatFns(parseISO(dateStr), dateFormat) : null
}

function formatWithoutParsing(date, dateFormat = DATE_LONG_FORMAT_2) {
  return isUnparsedDateValid(date) ? formatFns(date, dateFormat) : null
}

function formatMediumDate(dateString) {
  return format(dateString, DATE_MEDIUM_FORMAT)
}

function formatLongDate(dateString) {
  return format(dateString, DATE_LONG_FORMAT_1)
}

function formatMediumDateTime(dateString) {
  return format(dateString, DATE_TIME_MEDIUM_FORMAT)
}

const padZero = (value) => {
  const parsedValue = parseInt(value, 10)
  if (Number.isNaN(parsedValue)) {
    return value
  }
  return parsedValue < 10 ? `0${parsedValue}` : parsedValue.toString()
}

function normaliseAndFormatDate(year, month, day) {
  const y = padZero(year)
  const m = padZero(month)
  const yearAndMonth = `${padZero(y)}-${padZero(m)}`
  return day ? `${yearAndMonth}-${padZero(day)}` : yearAndMonth
}

function transformValueForAPI({ year, month, day = 1 }) {
  if (year && month && day) {
    return normaliseAndFormatDate(year, month, day)
  }

  return null
}

function parseDateString(dateString) {
  if (dateString.indexOf('/') !== -1) {
    const parts = dateString.split('/')
    return new Date(parts[2], parts[1] - 1, parts[0])
  } else {
    const date = new Date(dateString)
    if (date.toString() !== 'Invalid Date') {
      return date
    }
  }
  return null
}

function createAndFormatDateObject(date, dateFormat = DATE_LONG_FORMAT_3) {
  return parse(date, dateFormat, new Date())
}

/**
 * Get the number of days to a given date as an integer.
 */
function getDifferenceInDays(dateIn) {
  const today = endOfToday()
  return differenceInCalendarDays(new Date(dateIn), today)
}

/**
 * Get the number of days left or days ago that an input date is as a string.
 */
function getDifferenceInDaysLabel(dateIn) {
  const difference = getDifferenceInDays(dateIn)
  return Math.abs(difference) === 1 ? difference + ' day' : difference + ' days'
}

function getFinancialYearStart(date) {
  return date.getMonth() < 3 ? date.getFullYear() - 1 : date.getFullYear()
}

function generateFinancialYearLabel(yearStart) {
  return `${yearStart}-${(yearStart + 1).toString().slice(-2)}`
}

function getInteractionTimestamp({ offset }) {
  const date = new Date()

  if (offset > 0) {
    subMonths(date, offset)
  }

  return format(date, INTERACTION_TIMESTAMP_FORMAT)
}

function getDifferenceInWords(date, suffix = true) {
  const formattedDate = formatDistanceToNowStrict(parseISO(date), {
    addSuffix: suffix,
  })
  if (formattedDate == '1 day ago') {
    return 'a day ago'
  } else {
    return formattedDate
  }
}

function parseInvestmentDate(dateStr) {
  return {
    day: parseInt(formatFns(new Date(dateStr), 'd')),
    month: parseInt(formatFns(new Date(dateStr), 'M')),
    year: parseInt(formatFns(new Date(dateStr), 'yyyy')),
  }
}

module.exports = {
  addDays,
  addMonths,
  addYears,
  convertMinutesToHours,
  createAndFormatDateObject,
  format,
  formatMediumDate,
  formatMediumDateTime,
  formatLongDate,
  formatWithoutParsing,
  generateFinancialYearLabel,
  getDifferenceInDays,
  getDifferenceInDaysLabel,
  getDifferenceInWords,
  getInteractionTimestamp,
  getFinancialYearStart,
  getYesterday,
  isDateAfter,
  isDateValid,
  isNormalisedDateValid,
  isShortDateValid,
  isUnparsedDateValid,
  parseDateString,
  parseInvestmentDate,
  subtractDays,
  subtractMonths,
  subtractYears,
  subtractWeeks,
  today,
  transformValueForAPI,
}
