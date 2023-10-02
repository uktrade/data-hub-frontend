import { OPTION_YES } from '../../../../../apps/constants'
import { DATE_LONG_FORMAT_3 } from '../../../../../common/constants'
import {
  addDays,
  addMonths,
  formatWithoutParsing,
  transformValueForAPI,
} from '../../../../utils/date'

export const transformFormValuesForAPI = (
  formValues,
  investmentProject,
  currentAdviserId
) => ({
  investment_project: {
    id: investmentProject.id,
    name: investmentProject.name,
  },
  task: {
    title: formValues.taskTitle,
    description: formValues.taskDescription,
    due_date: getDueDate(formValues.taskDueDate, formValues.customDate),
    email_reminders_enabled: formValues.taskRemindersEnabled === OPTION_YES,
    reminder_days: formValues.taskReminderDays
      ? parseInt(formValues.taskReminderDays)
      : null,
    advisers: [currentAdviserId],
  },
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
