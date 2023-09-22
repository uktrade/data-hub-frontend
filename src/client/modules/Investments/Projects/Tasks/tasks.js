import { apiProxyAxios } from '../../../../components/Task/utils'
import { transformValueForAPI } from '../../../../utils/date'
import { OPTION_YES } from '../../../../../apps/constants'

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
  const endpoint = `/v4/investmentprojecttask`

  return request(endpoint, {
    investment_project: {
      id: investmentProject.id,
      name: investmentProject.name,
    },
    task: {
      title: taskTitle,
      description: taskDescription,
      due_date: customDate ? transformValueForAPI(customDate) : taskDueDate,
      email_reminders_enabled: taskRemindersEnabled === OPTION_YES,
      reminder_days: parseInt(taskReminderDays),
      advisers: [],
    },
  })
}
