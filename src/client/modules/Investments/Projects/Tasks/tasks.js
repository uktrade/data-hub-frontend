import { apiProxyAxios } from '../../../../components/Task/utils'

export const createInvestmentProjectTask = ({
  investmentProject,
  taskTitle,
  taskDescription,
  taskDueDate,
  taskReminder,
}) => {
  apiProxyAxios.post(`v4/investmentprojecttask/`, {
    investmentProject: investmentProject,
    task: {
      title: taskTitle,
      description: taskDescription,
      due_date: taskDueDate,
      reminder_days: taskReminder,
      email_reminders_enabled: false,
    },
  })
}
