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
export const formatDays = (days, message) =>
  isEmpty(days)
    ? settings.OFF
    : `${days.join(', ').replace(/,([^,]*)$/, ' and$1')} ${message}`

/**
 * A function that transforms an array of `reminder_days` into an object
 * @param {array} reminder_days - an array of integers
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
    (object, value, index) => ({
      ...object,
      [`reminder_days_${index}`]: value,
    }),
    {}
  )

/**
 * A function that loops over the keys of a form values object extracting
 * all `reminder_days_x` fields and values, converting them to integers in the process
 * @param {object} formValues - the values of the form
 * @returns {object} an object that contains `reminder_days_x` keys and corresponding values
 * @example
 * From: {
 *  reminder_days_0: 5,
 *  reminder_days_1: 10,
 *  reminder_days_2: '15',
 *  foo: 'x'
 *  bar: 'y'
 *  baz: 'z'
 *  ...
 * }
 * To: {
 *  reminder_days_0: 5,
 *  reminder_days_1: 10,
 *  reminder_days_2: 15,
 * }
 */
export const getReminderDaysFromFormValues = (formValues) =>
  Object.keys(formValues).reduce((object, key) => {
    return {
      ...object,
      ...(key.startsWith('reminder_days_')
        ? { [key]: parseInt(formValues[key], 10) }
        : {}),
    }
  }, {})

export const transformReminderDaysToAPI = (formValues) =>
  Object.values(getReminderDaysFromFormValues(formValues))

/**
 * A function that takes a form values object and transforms it into
 * an event for Google Tag Manager (GTM)
 * @param {object} the form values object
 * @returns {object} an event for GTM
 */
export const transformFormDataToAnalyticsData = (formValues) => {
  const reminderDays = getReminderDaysFromFormValues(formValues)
  // We need to reindex the keys incase the user has
  // deleted some days and then added a bunch more
  const reIndexReminderDays = Object.keys(reminderDays).reduce(
    (object, key, index) => {
      return {
        ...object,
        [`reminder${index}`]: reminderDays[key],
      }
    },
    {}
  )
  return {
    ...reIndexReminderDays,
    remindersCount: Object.keys(reIndexReminderDays).length,
    wantsReminders: formValues.reminders,
    wantsEmailNotifications: formValues.emailNotifications,
  }
}
