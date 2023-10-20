import { OPTION_YES, DATE_LONG_FORMAT_3 } from '../../../../common/constants'
import {
  formatWithoutParsing,
  transformValueForAPI,
  addMonths,
  addDays,
} from '../../../utils/date'
import { OPTIONS } from './constants'

export const transformTaskFormValuesForAPI = (
  formValues,
  currentAdviserId
) => ({
  title: formValues.taskTitle,
  description: formValues.taskDescription,
  due_date: getDueDate(formValues.taskDueDate, formValues.customDate),
  email_reminders_enabled: formValues.taskRemindersEnabled === OPTION_YES,
  reminder_days: formValues.taskReminderDays
    ? parseInt(formValues.taskReminderDays)
    : null,
  advisers:
    formValues.taskAssignedTo === OPTIONS.ME
      ? [currentAdviserId]
      : formValues.taskAdvisers.map((a) => a.value),
})

const getDueDate = (taskDueDate, customDate) => {
  switch (taskDueDate) {
    case 'custom':
      return transformValueForAPI(customDate)
    case 'month':
      return formatWithoutParsing(addMonths(new Date(), 1), DATE_LONG_FORMAT_3)
    case 'week':
      return formatWithoutParsing(addDays(new Date(), 7), DATE_LONG_FORMAT_3)
    default:
      null
  }
}
