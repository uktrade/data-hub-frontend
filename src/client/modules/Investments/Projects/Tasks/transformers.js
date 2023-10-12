import { OPTION_NO, OPTION_YES } from '../../../../../apps/constants'
import { convertDateToFieldDateObject } from '../../../../utils/date'
import { transformTaskFormValuesForAPI } from '../../../Tasks/TaskForm/transformers'

export const transformFormValuesForAPI = (
  formValues,
  investmentProject,
  currentAdviserId
) => ({
  investment_project: {
    id: investmentProject.id,
    name: investmentProject.name,
  },
  task: transformTaskFormValuesForAPI(formValues, currentAdviserId),
})

export const transformAPIValuesForForm = (task) => ({
  id: task.id,
  investmentProject: task.investmentProjectTask.investmentProject,
  taskTitle: task.title,
  taskDescription: task.description,
  taskDueDate: task.dueDate ? 'custom' : 'none',
  customDate: task.dueDate ? convertDateToFieldDateObject(task.dueDate) : null,
  taskRemindersEnabled: task.emailRemindersEnabled ? OPTION_YES : OPTION_NO,
  taskReminderDays: task.reminderDays,
})
