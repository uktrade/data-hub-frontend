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
  differenceInDays,
  differenceInCalendarDays,
  isSameDay,
  endOfToday,
  startOfMonth: getStartOfMonth,
  isWithinInterval,
  endOfYesterday,
  format: formatFns,
  formatDistanceToNowStrict,
  isAfter,
  isValid,
  parse,
  parseISO,
  subDays,
  subMonths,
  subYears,
  subWeeks,
  differenceInCalendarMonths,
  isFuture,
  isEqual: areDatesEqual,
  endOfTomorrow,
} = require('date-fns')

const {
  DATE_LONG_FORMAT_1,
  DATE_LONG_FORMAT_2,
  DATE_LONG_FORMAT_3,
  DATE_MEDIUM_FORMAT,
  DATE_TIME_MEDIUM_FORMAT,
  DATE_SHORT_FORMAT,
  DATE_SHORT_FORMAT_2,
  INTERACTION_TIMESTAMP_FORMAT,
  DATE_DAY_MONTH,
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

function isDateInFuture(date) {
  return isFuture(date)
}

function isDateInFutureParsed(date) {
  return isFuture(parseISO(date))
}

function parseDateISO(date) {
  return parseISO(date)
}

function tomorrow() {
  return endOfTomorrow()
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
  return formatWithoutParsing(dateString, DATE_MEDIUM_FORMAT)
}

function formatMediumDateParsed(dateString) {
  return format(dateString, DATE_MEDIUM_FORMAT)
}

function formatLongDate(dateString) {
  return format(dateString, DATE_LONG_FORMAT_1)
}

function formatShortDate(dateString) {
  return format(dateString, DATE_SHORT_FORMAT_2)
}

function formatMediumDateTime(dateString) {
  return format(dateString, DATE_TIME_MEDIUM_FORMAT)
}

function formatMediumDateTimeWithoutParsing(dateString) {
  return formatWithoutParsing(dateString, DATE_TIME_MEDIUM_FORMAT)
}

const formatMonthYearDate = (date) =>
  formatFns(parse(date, DATE_SHORT_FORMAT, new Date()), DATE_LONG_FORMAT_3)

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

  return formatWithoutParsing(date, INTERACTION_TIMESTAMP_FORMAT)
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

function createDateFromObject({ day, month, year }) {
  const monthIndex = parseInt(month, 10) - 1
  const result = new Date(year, monthIndex, day)
  return result
}

function formatStartAndEndDate(startDate, endDate) {
  if (startDate) {
    const startDateParsed = startDate ? parseISO(startDate) : startDate
    const endDateParsed = endDate ? parseISO(endDate) : endDate
    const startDateFormatted = startDate ? format(startDate) : startDate
    const endDateFormatted = endDate ? format(endDate) : endDate

    //When end date is missing or before start date
    if (!endDate || !isDateAfter(endDateParsed, startDateParsed)) {
      return startDateFormatted
    }
    //When start and end date are on same day
    if (startDateParsed.toDateString() === endDateParsed.toDateString()) {
      return startDateFormatted
    }
    // When start and end date are in the same month
    if (differenceInCalendarMonths(endDateParsed, startDateParsed) == 0) {
      return `${startDateParsed.getDate()} to ${endDateFormatted}`
    }
    // When start and end date are in the same year
    if (startDateParsed.getFullYear() === endDateParsed.getFullYear()) {
      return `${format(startDate, DATE_DAY_MONTH)} to ${endDateFormatted}`
    }
    // When start and end date are in different years
    return `${startDateFormatted} to ${endDateFormatted}`
  }
  return null
}

/**
 * Convert a date to a short object format required by the FieldDate component
 * @param {*} date a string representing a date or a Date type
 * @returns an object of the format {month:'', year:''}
 */
function convertDateToFieldShortDateObject(date) {
  const { month, year } = convertDateToFieldDateObject(date)
  return { month, year }
}

/**
 * Convert a date to a short object format required by the FieldDate component
 * @param {*} date a string representing a date or a Date type
 * @returns an object of the format {month:'', year:''}
 */
function convertUnparsedDateToFieldShortDateObject(date) {
  const { month, year } = convertUnparsedDateToFieldDateObject(date)
  return { month, year }
}

/**
 * Convert a date to an object format required by the FieldDate component
 * @param {*} date a string representing a date or a Date type
 * @returns an object of the format {day:'', month:'', year:''}
 */
function convertDateToFieldDateObject(date) {
  if (date && isValid(date)) {
    return {
      day: date.getDate(),
      month: date.getMonth() + 1, //getMonth is zero based
      year: date.getFullYear(),
    }
  } else {
    const parsedTime = parseISO(date)
    if (date && isValid(parsedTime)) {
      return {
        day: parsedTime.getDate(),
        month: parsedTime.getMonth() + 1, //getMonth is zero based
        year: parsedTime.getFullYear(),
      }
    }
  }
  return { day: '', month: '', year: '' }
}

/**
 * Same as convertDateToFieldDateObject, but for dates that don't need parsing
 */
function convertUnparsedDateToFieldDateObject(date) {
  if (isValid(date)) {
    return {
      day: date.getDate(),
      month: date.getMonth() + 1, //getMonth is zero based
      year: date.getFullYear(),
    }
  }
  return { day: '', month: '', year: '' }
}

/**
 * Generates a random date within the range specified by startDate and endDate (inclusive).
 * @param {Date} startDate - The start date of the range.
 * @param {Date} endDate - The end date of the range.
 * @returns {Date} A random date within the specified range.
 * @throws {Error} If startDate is greater than endDate or if startDate and endDate are the same date.
 */
function getRandomDateInRange(startDate, endDate) {
  if (isSameDay(startDate, endDate)) {
    throw new Error('Start date and end date cannot be the same.')
  }
  if (startDate > endDate) {
    throw new Error('Start date cannot be greater than end date.')
  }
  const daysDifference = differenceInDays(endDate, startDate)
  const randomNumberOfDays = Math.floor(Math.random() * (daysDifference + 1))
  return addDays(startDate, randomNumberOfDays)
}

/**
 * Returns the start date (1st day) of the month twelve months ago from the current date.
 * @returns {Date} The start date (1st day) of the month twelve months ago from the current date.
 */
function getStartDateOfTwelveMonthsAgo() {
  return subMonths(getStartOfMonth(new Date()), 12)
}

/**
 * Checks if a given date falls within the last twelve months from the current date.
 * The last twelve months include the 1st of the month.
 * @param {Date} date - The date to be checked.
 * @returns {boolean} Returns true if the date falls within the last twelve months
 * from the current date, otherwise false.
 */
function isWithinLastTwelveMonths(date) {
  return isWithinInterval(date, {
    start: getStartDateOfTwelveMonthsAgo(),
    end: new Date(),
  })
}

module.exports = {
  addDays,
  addMonths,
  addYears,
  createAndFormatDateObject,
  format,
  formatMediumDate,
  formatMediumDateTime,
  formatLongDate,
  formatShortDate,
  formatMonthYearDate,
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
  subtractDays,
  subtractMonths,
  subtractYears,
  subtractWeeks,
  today,
  transformValueForAPI,
  createDateFromObject,
  formatStartAndEndDate,
  convertDateToFieldShortDateObject,
  isDateInFuture,
  parseDateISO,
  convertDateToFieldDateObject,
  getRandomDateInRange,
  isWithinLastTwelveMonths,
  getStartDateOfTwelveMonthsAgo,
  getStartOfMonth,
  subtractMonths,
  areDatesEqual,
  tomorrow,
  formatMediumDateTimeWithoutParsing,
  formatMediumDateParsed,
  convertUnparsedDateToFieldDateObject,
  convertUnparsedDateToFieldShortDateObject,
  isDateInFutureParsed,
}
