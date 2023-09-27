import { OPTION_YES } from '../../../../../apps/constants'
import { DATE_LONG_FORMAT_3 } from '../../../../../common/constants'
import {
  addDays,
  addMonths,
  formatWithoutParsing,
  transformValueForAPI,
} from '../../../../utils/date'

export const transformFormValuesForAPI = ({
  investmentProject,
  currentAdviserId,
  taskTitle,
  taskDescription,
  customDate,
  taskDueDate,
  taskRemindersEnabled,
  taskReminderDays,
}) => ({
  investment_project: {
    id: investmentProject.id,
    name: investmentProject.name,
  },
  task: {
    title: taskTitle,
    description: taskDescription,
    due_date: getDueDate(taskDueDate, customDate),
    email_reminders_enabled: taskRemindersEnabled === OPTION_YES,
    reminder_days: taskReminderDays ? parseInt(taskReminderDays) : null,
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
