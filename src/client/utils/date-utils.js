const { format, parseISO } = require('date-fns')

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
 * Formats a given date string into a specified format using `date-fns`.
 *
 * @param {string} dateISO - The date string in ISO format (e.g., '2024-12-04').
 * @param {string} [dateISOFormat=DATE_FORMAT_COMPACT] - The format to use for formatting the date.
 *    Available format constants include:
 *    - `DATE_FORMAT_FULL`: Full date with day and full month name (e.g., '4 December 2024').
 *    - `DATE_FORMAT_FULL_DAY`: Full date with weekday included (e.g., 'Wed, 04 Dec 2024').
 *    - `DATE_FORMAT_COMPACT`: Compact date with abbreviated month name (e.g., '04 Dec 2024').
 *    - `DATE_FORMAT_ISO`: ISO standard format (e.g., '2024-12-04').
 *    - `DATE_FORMAT_MEDIUM`: Medium date format with single-digit day (e.g., '4 Dec 2024').
 *    - `DATE_FORMAT_MEDIUM_WITH_TIME`: Medium date with 12-hour time (e.g., '4 Dec 2024, 3:30PM').
 *    - `DATE_FORMAT_YEAR_MONTH`: Year and month format (e.g., '2024-12').
 *    - `DATE_FORMAT_MONTH_YEAR`: Full month and year (e.g., 'December 2024').
 *    - `DATE_FORMAT_MONTH_ABBR_YEAR`: Abbreviated month and year (e.g., 'Dec 2024').
 *    - `DATE_FORMAT_DAY_MONTH`: Day and abbreviated month (e.g., '04 Dec').
 *    - `DATE_FORMAT_INTERACTION_TIMESTAMP`: Interaction timestamp format (e.g., '2024-12-4').
 * @returns {string} - The formatted date string.
 *
 * @example
 * // Format a date to the default compact format
 * formatDate('2024-12-04')
 * // Returns: '04 Dec 2024'
 *
 * @example
 * // Format a date to a full format
 * formatDate('2024-12-04', DATE_FORMAT_FULL)
 * // Returns: '4 December 2024'
 *
 * @example
 * // Format a date with abbreviated month and year
 * formatDate('2024-12-04', DATE_FORMAT_MONTH_ABBR_YEAR)
 * // Returns: 'Dec 2024'
 */
function formatDate(dateISO, dateISOFormat = DATE_FORMAT_COMPACT) {
  return format(parseISO(dateISO), dateISOFormat)
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
}
