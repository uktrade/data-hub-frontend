import { OPTION_YES } from '../../../../../apps/constants'
import { transformValueForAPI } from '../../../../utils/date'

export const transformFormValuesForAPI = ({
  investmentProject,
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
    advisers: [],
  },
})

const getOneMonthFromNow = () => {
  const date = new Date()
  date.setMonth(date.getMonth() + 1)
  return date.toISOString().slice(0, 10)
}

const getOneWeekFromNow = () => {
  const date = new Date()
  date.setDate(date.getDate() + 7)
  return date.toISOString().slice(0, 10)
}
const getDueDate = (taskDueDate, customDate) => {
  switch (taskDueDate) {
    case 'custom':
      return transformValueForAPI(customDate)
    case 'month':
      return getOneMonthFromNow()
    case 'week':
      return getOneWeekFromNow()
    default:
      null
  }
}
