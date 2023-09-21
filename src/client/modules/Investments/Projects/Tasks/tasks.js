import { apiProxyAxios } from '../../../../components/Task/utils'

export const createInvestmentProjectTask = ({
  investmentProject,
  taskTitle,
  taskDescription,
  taskDueDate,
  taskReminder,
}) => {
  const request = apiProxyAxios.post
  const endpoint = `/v4/investmentprojecttask/`
  return request(endpoint, {
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

// const request = apiProxyAxios.patch
// const endpoint = `/v4/company/${companyId}`
// return request(endpoint, { strategy: strategy })
