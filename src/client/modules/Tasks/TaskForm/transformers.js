import { addDays, addMonths } from 'date-fns'

import { transformOptionToValue } from '../../../../apps/transformers'
import { OPTION_YES, OPTION_NO } from '../../../../common/constants'
import {
  transformArrayIdNameToValueLabel,
  transformIdNameToValueLabel,
} from '../../../transformers'
import {
  isoStringToDateParts,
  formatDateWithYearMonth,
} from '../../../utils/date'
import { formatDate, DATE_FORMAT_ISO } from '../../../utils/date-utils'

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
  if (formValues?.investmentProject?.value) {
    return {
      investment_project: formValues.investmentProject.value,
      company: null,
      interaction: null,
    }
  }
  if (formValues?.interaction?.id) {
    return {
      investment_project: null,
      company: null,
      interaction: formValues.interaction.id,
    }
  }
  if (formValues.company) {
    return {
      investment_project: null,
      company: transformOptionToValue(formValues.company),
      interaction: null,
    }
  }
  return { investment_project: null, company: null, interaction: null }
}

export const getDueDate = (dueDate, customDate) => {
  const today = new Date()

  const handlers = {
    custom: () => formatDateWithYearMonth(customDate),
    month: () => formatDate(addMonths(today, 1), DATE_FORMAT_ISO),
    week: () => formatDate(addDays(today, 7), DATE_FORMAT_ISO),
  }

  return handlers[dueDate]?.()
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
  customDate: isoStringToDateParts(task.dueDate),
  emailRemindersEnabled: task.emailRemindersEnabled ? OPTION_YES : OPTION_NO,
  reminderDays: task.reminderDays,
  assignedTo: transformAdvisor(task.advisers, currentAdviserId),
  advisers: transformArrayIdNameToValueLabel(task.advisers),
  company: task.company && transformIdNameToValueLabel(task.company),
  interaction: task.interaction,
})
