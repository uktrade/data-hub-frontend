import { currencyGBP } from '../../../../client/utils/number-utils'
import {
  subtractMonths,
  isDateAfter,
  getStartOfMonth,
} from '../../../utils/date'
/**
 * @param {String} winType the name of the win type
 * @param {Object} values the form values object containing the keys
 * @returns {Number} aggregated key values
 * @example
 * sumWinTypeYearlyValues('export_win', {
 *   ...
 *   export_win_0: '1',
 *   export_win_1: '',
 *   export_win_2: '2',
 *   export_win_3: '3',
 *   export_win_4: '4',
 *   ...
 * }) // 10
 */
export const sumWinTypeYearlyValues = (winType, values) =>
  Object.keys(values)
    .filter((k) => k.startsWith(winType))
    .reduce((acc, value) => acc + Number(values[value]), 0)

/**
 * @param {Array} winTypes the list of win types
 * @param {Object} values the form value object
 * @returns {Number} the aggregated value of all win type yearly values
 * @example
 * sumAllWinTypeYearlyValues(['export_win', 'business_success_win', 'odi_win'], {
 *   ...
 *   export_win_0: '2',
 *   export_win_1: '2',
 *   export_win_2: '2',
 *   export_win_3: '2',
 *   export_win_4: '2',
 *   business_success_win_0: '3',
 *   business_success_win_1: '3',
 *   business_success_win_2: '3',
 *   business_success_win_3: '3',
 *   business_success_win_4: '3',
 *   odi_win_0: '4',
 *   odi_win_1: '4',
 *   odi_win_2: '4',
 *   odi_win_3: '4',
 *   odi_win_4: '4',
 *   ...
 * }) // 45
 */
export const sumAllWinTypeYearlyValues = (winTypes = [], values) =>
  winTypes.reduce((acc, val) => acc + sumWinTypeYearlyValues(val, values), 0)

/**
 * @param {String} winType the name of the win type
 * @param {Object} values the form value object
 * @returns the year of the last win type value
 * @example
 * getYearFromWinType('export_win', {
 *   ...
 *   export_win_0: '2',
 *   export_win_1: '2',
 *   export_win_2: '',
 *   export_win_3: '',
 *   export_win_4: '',
 *   ...
 * }) // 2
 * getYearFromWinType('export_win', {
 *   ...
 *   export_win_0: '',
 *   export_win_1: '2',
 *   export_win_2: '2',
 *   export_win_3: '',
 *   export_win_4: '',
 *   ...
 * }) // 3
 * getYearFromWinType('export_win', {
 *   ...
 *   export_win_0: '',
 *   export_win_1: '',
 *   export_win_2: '',
 *   export_win_3: '2',
 *   export_win_4: '2',
 *   ...
 * }) // 5
 */

export const getYearFromWinType = (winType, values) =>
  Object.keys(values)
    .filter((key) => key.startsWith(winType) && !!values[key])
    .reduce((acc, key) => Math.max(Number(key.slice(-1)) + 1, acc), 0)

/**
 * @param {String} winTypes the array of win types
 * @param {Object} values the form value object
 * @returns the max year of the last win type value across all win types
 * @example
 * getMaxYearFromWinTypes(['export_win', 'business_success_win', 'odi_win']) {
 *   export_win_0: '5',
 *   export_win_1: '',
 *   export_win_2: '',
 *   export_win_3: '',
 *   export_win_4: '',
 *   business_success_win_0: '10',
 *   business_success_win_1: '15',
 *   business_success_win_2: '',
 *   business_success_win_3: '',
 *   business_success_win_4: '',
 *   odi_win_0: '',
 *   odi_win_1: '',
 *   odi_win_2: '8',
 *   odi_win_3: '8',
 *   odi_win_4: '',
 * }) // 4
 */
export const getMaxYearFromWinTypes = (winTypes, values) =>
  Math.max(...winTypes.map((winType) => getYearFromWinType(winType, values)))

/**
 * Returns a date that is 12 months ago from the current date that includes the 1st of the month
 * @returns {Date} A date that is 12 months ago from the current date that includes the 1st of the month
 */
export const getDateTwelveMonthsAgoWithFirstDay = () =>
  subtractMonths(getStartOfMonth(new Date()), 12)

/**
 * Tests whether a given date is within the last twelve months and not in the future.
 * @param {Date} date - The date to test.
 * @returns {boolean} True if the date is within the last twelve months and not in the future, false otherwise.
 */
export const isWithinLastTwelveMonths = (date) =>
  // Business date logic
  isDateAfter(date, new Date())
    ? false // Date is in the future
    : isDateAfter(date, getDateTwelveMonthsAgoWithFirstDay())

export const formatValue = (sum) => currencyGBP(sum)
