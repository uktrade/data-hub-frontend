/**
 * The purpose of this file is so we can have a centralised location for all date transformation functions, instead of having two separate date-util files.
 * This reduces duplication of functions across the codebase as the two pre-existing files contained many identical functions.
 * As these functions are used in both client-side and server-side code, they need to be exported using `module.exports` and imported using `const {} = require()`
 * so they can be used in both CommonJS and ES6 files.
 * Once the React transition is complete, we will be able to convert all these functions to ES6 modules.
 */

const {
  differenceInCalendarDays,
  endOfToday,
  formatDistanceToNowStrict,
  isValid,
  parse,
  parseISO,
} = require('date-fns')

const {
  formatDate,
  DATE_FORMAT_ISO,
  DATE_FORMAT_YEAR_MONTH,
} = require('./date-utils')

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

module.exports = {
  generateFinancialYearLabel,
  getDifferenceInDays,
  getDifferenceInDaysLabel,
  getDifferenceInWords,
  getFinancialYearStart,
  parseDateWithYearMonth,
  formatDateWithYearMonth,
  convertDateToFieldShortDateObject,
  convertDateToFieldDateObject,
  convertUnparsedDateToFieldDateObject,
  convertUnparsedDateToFieldShortDateObject,
}
