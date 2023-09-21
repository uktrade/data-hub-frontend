import { addDays, addMonths } from 'date-fns'
import { apiProxyAxios } from '../../../../components/Task/utils'

export const createInvestmentProjectTask = ({
  investmentProject,
  taskTitle,
  taskDescription,
  customDate,
  taskDueDate,
  taskRemindersEnabled,
  taskReminderDays,
}) => {
  const request = apiProxyAxios.post
  const endpoint = `/v4/investmentprojecttask/`
  const dueDaysToDate = (dueDays) => {
    const today = new Date()
    const oneWeek = addDays(today, 7)
    const oneMonth = addMonths(today, 1)
    if (dueDays === '1 week') {
      return oneWeek
    } else if (dueDays === '1 month') {
      return oneMonth
    } else if (dueDays === 'Custom date') {
      return customDate
    } else {
      return null
    }
  }

  return request(endpoint, {
    investmentProject: investmentProject,
    task: {
      title: taskTitle,
      description: taskDescription,
      due_date: dueDaysToDate(taskDueDate),
      email_reminders_enabled: taskRemindersEnabled === 'yes',
      reminder_days: parseInt(taskReminderDays),
      advisers: [
        {
          name: 'Claudia Gonzalez-Casales',
          first_name: 'Claudia',
          last_name: 'Gonzalez-Casales',
          id: '0a3f1470-24a6-4974-90b0-ffe4cb5e5e3b',
        },
      ],
    },
  })
}
