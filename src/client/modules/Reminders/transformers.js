import { isEmpty } from 'lodash'
import { settings } from './constants'
/**
 * A function that formats an array of numbers (days) and appends a message that is grammatically correct.
 * @param {array} days - an array of numbers representing days
 * @param {string} message - a string that's concatenated to the end of the formatted days
 * @returns a formatted string that displays a list of days separated
 * by commas and the word 'and', for example, if the message was 'days after the last interaction'
 * the output would be:
 * [] -> 'Off'
 * [35] -> '35 days after the last interaction'
 * [35, 40] -> '35 and 40 days after the last interaction'
 * [35, 40, 60] -> '35, 40 and 60 days after the last interaction'
 * [35, 40, 60, 80] -> '35, 40, 60 and 80 days after the last interaction'
 * ...
 */
export const transformDays = (days, message) =>
  isEmpty(days)
    ? settings.OFF
    : `${days.join(', ').replace(/,([^,]*)$/, ' and$1')} ${message}`
