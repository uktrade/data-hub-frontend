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
  investment_project: investmentProject,
  task: {
    task_title: taskTitle,
    task_description: taskDescription,
    due_date: customDate ? transformValueForAPI(customDate) : taskDueDate,
    email_reminders_enabled: taskRemindersEnabled === OPTION_YES,
    reminder_days: taskReminderDays ? parseInt(taskReminderDays) : null,
    advisers: [],
  },
})
