const { format } = require('date-fns')

/**
 * Two-digit day format.
 * Example: 04
 */
const DATE_FORMAT_DAY = 'dd'

/**
 * Two-digit month format.
 * Example: 12
 */
const DATE_FORMAT_MONTH = 'MM'

/**
 * Four-digit year format.
 * Example: 2024
 */
const DATE_FORMAT_YEAR = 'yyyy'

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
 * Full date format with two-digit day and full month name.
 * Example: 04 December 2024
 */
const DATE_FORMAT_DAY_MONTH_YEAR = 'dd MMMM yyyy'

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
 * ISO 8601 date format with full time precision.
 * Example: 2024-12-04T15:30:45
 */
const DATE_FORMAT_ISO_WITH_TIME_FULL = "yyyy-MM-dd'T'HH:mm:ss"

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
 * Formats a given date into a string using a specified format.
 *
 * @param {Date | number | string} date - The date to format.
 *   Can be a Date object, a timestamp (number), or a valid date string.
 * @param {string} [dateISOFormat=DATE_FORMAT_COMPACT] - The format string used to format the date.
 *   Commonly used predefined constants:
 *   - `DATE_FORMAT_DAY`: Two-digit day (e.g., "04").
 *   - `DATE_FORMAT_MONTH`: Two-digit month (e.g., "12").
 *   - `DATE_FORMAT_YEAR`: Four-digit year (e.g., "2024").
 *   - `DATE_FORMAT_FULL`: Day, full month name, and year (e.g., "18 December 2024").
 *   - `DATE_FORMAT_FULL_DAY`: Weekday, day, abbreviated month, and year (e.g., "Wed, 18 Dec 2024").
 *   - `DATE_FORMAT_COMPACT`: Two-digit day, abbreviated month, and year (e.g., "18 Dec 2024").
 *   - `DATE_FORMAT_DAY_MONTH_YEAR`: Two-digit day, full month name, and year (e.g., "18 December 2024").
 *   - `DATE_FORMAT_ISO`: ISO date format (e.g., "2024-12-18").
 *   - `DATE_FORMAT_MEDIUM`: Single-digit day, abbreviated month, and year (e.g., "18 Dec 2024").
 *   - `DATE_FORMAT_MEDIUM_WITH_TIME`: Medium date with time in 12-hour format (e.g., "18 Dec 2024, 3:30PM").
 *   - `DATE_FORMAT_ISO_WITH_TIME_FULL`: ISO 8601 date with time (e.g., "2024-12-18T15:30:45").
 *   - `DATE_FORMAT_YEAR_MONTH`: Year and two-digit month (e.g., "2024-12").
 *   - `DATE_FORMAT_MONTH_YEAR`: Full month name and year (e.g., "December 2024").
 *   - `DATE_FORMAT_MONTH_ABBR_YEAR`: Abbreviated month and year (e.g., "Dec 2024").
 *   - `DATE_FORMAT_DAY_MONTH`: Two-digit day and abbreviated month (e.g., "18 Dec").
 *   - `DATE_FORMAT_INTERACTION_TIMESTAMP`: Interaction timestamp (e.g., "2024-12-18").
 *
 * @returns {string} The formatted date string.
 *
 * @example
 * formatDate(new Date(), DATE_FORMAT_FULL) // "18 December 2024"
 * formatDate(1700000000000, DATE_FORMAT_ISO) // "2024-12-18"
 * formatDate("2024-12-18T15:30:45", DATE_FORMAT_COMPACT) // "18 Dec 2024"
 */
function formatDate(date, dateISOFormat = DATE_FORMAT_COMPACT) {
  return format(date, dateISOFormat)
}

module.exports = {
  DATE_FORMAT_DAY,
  DATE_FORMAT_MONTH,
  DATE_FORMAT_YEAR,
  DATE_FORMAT_FULL,
  DATE_FORMAT_FULL_DAY,
  DATE_FORMAT_COMPACT,
  DATE_FORMAT_ISO,
  DATE_FORMAT_MEDIUM,
  DATE_FORMAT_MEDIUM_WITH_TIME,
  DATE_FORMAT_ISO_WITH_TIME_FULL,
  DATE_FORMAT_YEAR_MONTH,
  DATE_FORMAT_MONTH_YEAR,
  DATE_FORMAT_MONTH_ABBR_YEAR,
  DATE_FORMAT_DAY_MONTH,
  DATE_FORMAT_DAY_MONTH_YEAR,
  DATE_FORMAT_INTERACTION_TIMESTAMP,
  formatDate,
}
