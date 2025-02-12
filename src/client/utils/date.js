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
 * Converts an ISO 8601 date string into an object with year, month, and day properties.
 *
 * @param {string} isoString - The ISO 8601 date string to convert (e.g., "2025-10-31").
 * @returns {Object} - An object with the following properties:
 *                     - year: {number|string} The year from the date (e.g., 2025). Empty string if invalid.
 *                     - month: {number|string} The 1-based month (1-12). Empty string if invalid.
 *                     - day: {number|string} The day of the month (1-31). Empty string if invalid.
 *
 * @example
 * isoStringToDateParts('2025-10-31')
 * // Returns: { year: 2025, month: 10, day: 31 }
 *
 * isoStringToDateParts('invalid-date')
 * // Returns: { year: '', month: '', day: '' }
 */
function isoStringToDateParts(isoString) {
  const emptyDateParts = { year: '', month: '', day: '' }

  if (!isoString) {
    return emptyDateParts
  }

  const date = parseISO(isoString)

  return isValid(date)
    ? {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      }
    : emptyDateParts
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

module.exports = {
  parseDateWithYearMonth,
  formatDateWithYearMonth,
  isoStringToDateParts,
  generateFinancialYearLabel,
  getDifferenceInDays,
  getDifferenceInDaysLabel,
  getDifferenceInWords,
  getFinancialYearStart,
}
