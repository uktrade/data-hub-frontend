const { format, parseISO, isValid } = require('date-fns')

/**
 * Full date format with day and full month name.
 * Example: 4 December 2024
 */
const DATE_FORMAT_FULL = 'd MMMM yyyy'

/**
 * Full date format including the weekday.
 * Example: Wed, 04 Dec 2024
 */
const DATE_FORMAT_FULL_DAY = 'E, dd MMM yyyy'

/**
 * Compact date format with two-digit day and abbreviated month name.
 * Example: 04 Dec 2024
 */
const DATE_FORMAT_COMPACT = 'dd MMM yyyy'

/**
 * ISO standard date format.
 * Example: 2024-12-04
 */
const DATE_FORMAT_ISO = 'yyyy-MM-dd'

/**
 * Medium date format with single-digit day and abbreviated month name.
 * Example: 4 Dec 2024
 */
const DATE_FORMAT_MEDIUM = 'd MMM yyyy'

/**
 * Medium date format with time included in 12-hour format.
 * Example: 4 Dec 2024, 3:30PM
 */
const DATE_FORMAT_MEDIUM_WITH_TIME = 'd MMM yyyy, h:mmaaa'

/**
 * Year and month format for compact representations.
 * Example: 2024-12
 */
const DATE_FORMAT_YEAR_MONTH = 'yyyy-MM'

/**
 * Month and year format with full month name.
 * Example: December 2024
 */
const DATE_FORMAT_MONTH_YEAR = 'MMMM yyyy'

/**
 * Abbreviated month and year format.
 * Example: Dec 2024
 */
const DATE_FORMAT_MONTH_ABBR_YEAR = 'MMM yyyy'

/**
 * Day and month format with abbreviated month name.
 * Example: 04 Dec
 */
const DATE_FORMAT_DAY_MONTH = 'dd MMM'

/**
 * Interaction timestamp format with single-digit day and month.
 * Example: 2024-12-4
 */
const DATE_FORMAT_INTERACTION_TIMESTAMP = 'y-MM-d'

/**
 * Formats a date into the specified string format using predefined constants.
 *
 * @param {Date|string} date - The date to format. Can be a Date object or an ISO date string (e.g., '2024-12-04').
 * @param {string} [dateISOFormat=DATE_FORMAT_COMPACT] - The desired format string. Defaults to the compact date format (`DATE_FORMAT_COMPACT`).
 *   Available formats include:
 *     - `DATE_FORMAT_FULL`: Full date with day and full month name (e.g., '4 December 2024').
 *     - `DATE_FORMAT_FULL_DAY`: Full date including the weekday (e.g., 'Wed, 04 Dec 2024').
 *     - `DATE_FORMAT_COMPACT`: Compact date format with abbreviated month (e.g., '04 Dec 2024').
 *     - `DATE_FORMAT_ISO`: ISO standard date format (e.g., '2024-12-04').
 *     - `DATE_FORMAT_MEDIUM`: Medium date with abbreviated month (e.g., '4 Dec 2024').
 *     - `DATE_FORMAT_MEDIUM_WITH_TIME`: Medium date with time in 12-hour format (e.g., '4 Dec 2024, 3:30PM').
 *     - `DATE_FORMAT_YEAR_MONTH`: Year and month in compact form (e.g., '2024-12').
 *     - `DATE_FORMAT_MONTH_YEAR`: Full month name and year (e.g., 'December 2024').
 *     - `DATE_FORMAT_MONTH_ABBR_YEAR`: Abbreviated month name and year (e.g., 'Dec 2024').
 *     - `DATE_FORMAT_DAY_MONTH`: Day and abbreviated month (e.g., '04 Dec').
 *     - `DATE_FORMAT_INTERACTION_TIMESTAMP`: Timestamp-like format (e.g., '2024-12-4').
 *
 * @returns {string} The formatted date string based on the specified format.
 *
 * @example
 * // Formatting with default format (DATE_FORMAT_COMPACT)
 * formatDate(new Date('2024-12-04')) // '04 Dec 2024'
 *
 * @example
 * // Formatting with a different predefined format
 * formatDate('2024-12-04', DATE_FORMAT_FULL) // '4 December 2024'
 *
 * @example
 * // Formatting with a timestamp-like format
 * formatDate(new Date(), DATE_FORMAT_INTERACTION_TIMESTAMP) // '2024-12-9'
 */
function formatDate(date, dateISOFormat = DATE_FORMAT_COMPACT) {
  return format(typeof date === 'string' ? parseISO(date) : date, dateISOFormat)
}

/**
 * Normalises an input value to a valid Date object.
 *
 * This function accepts either an ISO 8601 string or a Date object as input.
 * - If the input is a valid ISO string, it is parsed into a Date object.
 * - If the input is a valid Date object, it is returned as-is.
 * - If the input is invalid or not a recognised type, it returns `null`.
 *
 * @param {string|Date} value - The value to be normalised. Can be an ISO 8601 string or a Date object.
 * @returns {Date|null} A valid Date object if the input is valid; otherwise, `null`.
 *
 * @example
 * // Valid ISO string input
 * normalizeToDate('2024-12-10T14:30:00Z') // Returns a Date object
 *
 * @example
 * // Valid Date object input
 * normalizeToDate(new Date('2024-12-10T14:30:00Z')) // Returns the same Date object
 *
 * @example
 * // Invalid string input
 * normalizeToDate('invalid-date') // Returns null
 *
 * @example
 * // Non-date input
 * normalizeToDate(12345) // Returns null
 */
function normaliseToDate(value) {
  if (typeof value === 'string') {
    const date = parseISO(value)
    return isValid(date) ? date : null
  } else if (value instanceof Date) {
    return isValid(value) ? value : null
  }
  return null
}

module.exports = {
  DATE_FORMAT_FULL,
  DATE_FORMAT_FULL_DAY,
  DATE_FORMAT_COMPACT,
  DATE_FORMAT_ISO,
  DATE_FORMAT_MEDIUM,
  DATE_FORMAT_MEDIUM_WITH_TIME,
  DATE_FORMAT_YEAR_MONTH,
  DATE_FORMAT_MONTH_YEAR,
  DATE_FORMAT_MONTH_ABBR_YEAR,
  DATE_FORMAT_DAY_MONTH,
  DATE_FORMAT_INTERACTION_TIMESTAMP,
  formatDate,
  normaliseToDate,
}
