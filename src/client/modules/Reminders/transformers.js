import { isEmpty, pickBy } from 'lodash'
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
export const formatDays = (days, message) =>
  isEmpty(days)
    ? settings.OFF
    : `${days.join(', ').replace(/,([^,]*)$/, ' and$1')} ${message}`

/**
 * A function that transforms an array of `reminder_days` into an object
 * @param {array} reminder_days - an array of numbers
 * @returns {object} an object containing the reminder days compatible
 * with the FieldAddAnother component
 * @example
 * From: [5, 10, 15, ...]
 * To: {
 *  reminder_days_0: 5,
 *  reminder_days_1: 10,
 *  reminder_days_2: 15,
 *  ...
 * }
 */
export const transformReminderDaysToForm = (reminder_days) =>
  reminder_days.reduce(
    (accumulator, value, index) => ({
      ...accumulator,
      [`reminder_days_${index}`]: value,
    }),
    {}
  )

/**
 * A function that loops over the keys of an object extracting all `reminder_days_x`
 * @param {object} state - the form state
 * @returns {array} an array of numbers representing reminder days
 * @example
 * From: {
 *  reminder_days_0: 5,
 *  reminder_days_1: 10,
 *  reminder_days_2: 15,
 *  foo: 'x'
 *  bar: 'y'
 *  ...
 * }
 * To: [5, 10, 15]
 */
export const transformReminderDaysToAPI = (state) =>
  Object.keys(state)
    .map((key) => (key.startsWith('reminder_days_') ? state[key] : null))
    .filter((value) => value != null)

/**
 * A function that takes a form state object and transforms it into
 * an event for Google Tag Manager (GTM)
 * @param {object} form state
 * @returns {object} an event for GTM
 */
export const transformFormDataToAnalyticsData = (state) => {
  const reminders = pickBy({
    reminder0: state.reminder_days_0,
    reminder1: state.reminder_days_1,
    reminder2: state.reminder_days_2,
    reminder3: state.reminder_days_3,
    reminder4: state.reminder_days_4,
  })
  return {
    ...reminders,
    remindersCount: Object.keys(reminders).length,
    wantsReminders: state.reminders,
    wantsEmailNotifications: state.emailNotifications,
  }
}
