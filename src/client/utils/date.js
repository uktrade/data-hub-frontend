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

/**
 * Parses a date string given a year, month, and optional day.
 *
 * @param {string} year - The year as a string (e.g., '2024').
 * @param {string} month - The month as a string (1-based, e.g., '12' for December).
 * @param {string} [day] - The optional day as a string (e.g., '31'). If omitted, defaults to the first day of the month.
 * @returns {Date} A `Date` object representing the parsed date. If the input values are invalid,
 *                 the returned `Date` object will be invalid (check with `isValid(date)`).
 *
 * @example
 * // Full date parsing
 * const date = parseDateWithYearMonth('2024', '12', '31')
 * console.log(date) // Outputs: Tue Dec 31 2024 00:00:00 GMT+0000 (UTC)
 *
 * @example
 * // Parsing only year and month
 * const date = parseDateWithYearMonth('2024', '12')
 * console.log(date) // Outputs: Sun Dec 01 2024 00:00:00 GMT+0000 (UTC)
 *
 * @example
 * // Invalid date
 * const date = parseDateWithYearMonth('2024', '13', '31')
 * console.log(isValid(date)) // Outputs: false
 *
 * @note This function does not throw errors for invalid inputs but returns an invalid `Date` object instead.
 */
function parseDateWithYearMonth(year, month, day) {
  const dateString = day ? `${year}-${month}-${day}` : `${year}-${month}`
  const format = day ? DATE_FORMAT_ISO : DATE_FORMAT_YEAR_MONTH
  return parse(dateString, format, new Date())
}

/**
 * Formats a date string based on a given year, month, and optional day.
 *
 * @param {Object} params - The date components to format.
 * @param {string} params.year - The year as a string (e.g., '2024').
 * @param {string} params.month - The month as a string (1-based, e.g., '12' for December).
 * @param {string} [params.day] - The optional day as a string (e.g., '31'). If omitted, defaults to the first day of the month.
 * @returns {string} The formatted date string in either 'yyyy-MM-dd' or 'yyyy-MM'.
 *
 * @example
 * // Format full date
 * const formattedDate = formatDateWithYearMonth({ year: '2024', month: '12', day: '31' })
 * console.log(formattedDate) // Outputs: '2024-12-31'
 *
 * @example
 * // Format year and month only
 * const formattedDate = formatDateWithYearMonth({ year: '2024', month: '12' })
 * console.log(formattedDate) // Outputs: '2024-12'
 */
const formatDateWithYearMonth = ({ year, month, day }) => {
  return formatDate(
    parseDateWithYearMonth(year, month, day),
    day ? DATE_FORMAT_ISO : DATE_FORMAT_YEAR_MONTH
  )
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
  parseDateWithYearMonth,
  isUnparsedDateValid,
  formatDateWithYearMonth,
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
