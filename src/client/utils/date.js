/**
 * The purpose of this file is so we can have a centralised location for all date transformation functions, instead of having two separate date-util files.
 * This reduces duplication of functions across the codebase as the two pre-existing files contained many identical functions.
 * As these functions are used in both client-side and server-side code, they need to be exported using `module.exports` and imported using `const {} = require()`
 * so they can be used in both CommonJS and ES6 files.
 * Once the React transition is complete, we will be able to convert all these functions to ES6 modules.
 */

const {
  addDays,
  differenceInDays,
  differenceInCalendarDays,
  isSameDay,
  endOfToday,
  startOfMonth: getStartOfMonth,
  isWithinInterval,
  formatDistanceToNowStrict,
  isAfter,
  isValid,
  parse,
  parseISO,
  subMonths,
  differenceInCalendarMonths,
  isEqual: areDatesEqual,
} = require('date-fns')

const {
  formatDate,
  DATE_FORMAT_ISO,
  DATE_FORMAT_COMPACT,
  DATE_FORMAT_DAY_MONTH,
  DATE_FORMAT_YEAR_MONTH,
} = require('./date-utils')

/**
 * Date validation functions
 */

function isDateValid(date) {
  return isValid(parseISO(date))
}

function isUnparsedDateValid(date) {
  return isValid(date)
}

function isNormalisedDateValid(year, month, day, format = DATE_FORMAT_ISO) {
  const date = normaliseAndFormatDate(year, month, day)
  return isValid(parse(date, format, new Date()))
}

function isShortDateValid(year, month) {
  return isNormalisedDateValid(year, month, null, DATE_FORMAT_YEAR_MONTH)
}

/**
 * Parsing functions
 */

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
    const startDateFormatted = startDate
      ? formatDate(startDate, DATE_FORMAT_COMPACT)
      : startDate
    const endDateFormatted = endDate ? formatDate(endDate) : endDate

    //When end date is missing or before start date
    if (!endDate || !isAfter(endDateParsed, startDateParsed)) {
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
      return `${formatDate(startDate, DATE_FORMAT_DAY_MONTH)} to ${endDateFormatted}`
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
  generateFinancialYearLabel,
  getDifferenceInDays,
  getDifferenceInDaysLabel,
  getDifferenceInWords,
  getFinancialYearStart,
  isDateValid,
  isValid,
  isNormalisedDateValid,
  isShortDateValid,
  isUnparsedDateValid,
  transformValueForAPI,
  createDateFromObject,
  formatStartAndEndDate,
  convertDateToFieldShortDateObject,
  convertDateToFieldDateObject,
  getRandomDateInRange,
  isWithinLastTwelveMonths,
  getStartDateOfTwelveMonthsAgo,
  getStartOfMonth,
  areDatesEqual,
  convertUnparsedDateToFieldDateObject,
  convertUnparsedDateToFieldShortDateObject,
}
