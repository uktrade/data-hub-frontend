import { transformOptionToValue } from '../../../../apps/transformers'
import {
  OPTION_YES,
  DATE_LONG_FORMAT_3,
  OPTION_NO,
} from '../../../../common/constants'
import {
  transformArrayIdNameToValueLabel,
  transformIdNameToValueLabel,
} from '../../../transformers'
import {
  formatWithoutParsing,
  transformValueForAPI,
  addMonths,
  addDays,
  convertDateToFieldDateObject,
} from '../../../utils/date'
import { OPTIONS } from './constants'

export const transformTaskFormValuesForAPI = (
  formValues,
  currentAdviserId
) => ({
  title: formValues.title,
  description: formValues.description,
  due_date: getDueDate(formValues.dueDate, formValues.customDate),
  email_reminders_enabled: formValues.emailRemindersEnabled === OPTION_YES,
  reminder_days: formValues.reminderDays
    ? parseInt(formValues.reminderDays)
    : null,
  advisers:
    formValues.assignedTo === OPTIONS.ME
      ? [currentAdviserId]
      : formValues.advisers.map((a) => a.value),
  ...getUniquePKValue(formValues),
})

const getUniquePKValue = (formValues) => {
  if (formValues.investmentProject) {
    return {
      investment_project: formValues.investmentProject.value,
      company: null,
    }
  }
  if (formValues.company) {
    return {
      investment_project: null,
      company: transformOptionToValue(formValues.company),
    }
  }
  return { investment_project: null, company: null }
}

const getDueDate = (dueDate, customDate) => {
  switch (dueDate) {
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

const transformAdvisor = (advisers, currentAdviserId) =>
  advisers.length === 1 && advisers[0].id === currentAdviserId
    ? OPTIONS.ME
    : OPTIONS.SOMEONE_ELSE

export const transformAPIValuesForForm = (task, currentAdviserId) => ({
  id: task.id,
  investmentProject:
    task.investmentProject &&
    transformIdNameToValueLabel(task.investmentProject),
  title: task.title,
  description: task.description,
  dueDate: task.dueDate ? 'custom' : 'none',
  customDate: task.dueDate ? convertDateToFieldDateObject(task.dueDate) : null,
  emailRemindersEnabled: task.emailRemindersEnabled ? OPTION_YES : OPTION_NO,
  reminderDays: task.reminderDays,
  assignedTo: transformAdvisor(task.advisers, currentAdviserId),
  advisers: transformArrayIdNameToValueLabel(task.advisers),
  company: task.company && transformIdNameToValueLabel(task.company),
})
