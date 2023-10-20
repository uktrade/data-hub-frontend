import { transformTaskFormValuesForAPI } from '../../../Tasks/TaskForm/transformers'
import { OPTION_NO, OPTION_YES } from '../../../../../common/constants'
import { convertDateToFieldDateObject } from '../../../../utils/date'
import { OPTIONS } from '../../../Tasks/TaskForm/constants'
import { idNamesToValueLabels } from '../../../../utils'

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

const transformAdvisor = (advisers, currentAdviserId) =>
  advisers.length === 1 && advisers[0].id === currentAdviserId
    ? OPTIONS.ME
    : OPTIONS.SOMEONE_ELSE

export const transformAPIValuesForForm = (task, currentAdviserId) => ({
  id: task.id,
  investmentProject: task.investmentProjectTask.investmentProject,
  taskTitle: task.title,
  taskDescription: task.description,
  taskDueDate: task.dueDate ? 'custom' : 'none',
  customDate: task.dueDate ? convertDateToFieldDateObject(task.dueDate) : null,
  taskRemindersEnabled: task.emailRemindersEnabled ? OPTION_YES : OPTION_NO,
  taskReminderDays: task.reminderDays,
  taskAssignedTo: transformAdvisor(task.advisers, currentAdviserId),
  taskAdvisers: idNamesToValueLabels(task.advisers),
})
