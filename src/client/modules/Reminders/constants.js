import { snakeCase } from 'lodash'

import urls from '../../../lib/urls'

export const settings = {
  OFF: 'Off',
  ON: 'On',
}

export const sortOptions = [
  {
    name: 'Most recent',
    value: '-created_on',
  },
  {
    name: 'Oldest',
    value: 'created_on',
  },
]

export const maxItemsToPaginate = 10000
export const itemsPerPage = 10

export const INVESTMENTS_ESTIMATED_LAND_DATES =
  'investments-estimated-land-dates'
export const INVESTMENTS_NO_RECENT_INTERACTIONS =
  'investments-no-recent-interactions'
export const INVESTMENTS_OUTSTANDING_PROPOSITIONS =
  'investments-outstanding-propositions'
export const COMPANIES_NO_RECENT_INTERACTIONS =
  'companies-no-recent-interactions'
export const COMPANIES_NEW_INTERACTIONS = 'companies-new-interactions'
export const MY_TASKS_DUE_DATE_APPROACHING = 'my-tasks-due-date-approaching'
export const TASK_ASSIGNED_TO_ME_FROM_OTHERS = 'task-assigned-to-me-from-others'
export const TASK_AMENDED_BY_OTHERS = 'task-amended-by-others'
export const TASK_OVERDUE = 'my-tasks-task-overdue'
export const TASK_COMPLETED = 'my-tasks-task-completed'

export const INVESTMENTS_ESTIMATED_LAND_DATES_LABEL =
  'Approaching estimated land dates'

export const INVESTMENTS_NO_RECENT_INTERACTIONS_LABEL =
  'Projects with no recent interactions'

export const INVESTMENTS_OUTSTANDING_PROPOSITIONS_LABEL =
  'Outstanding propositions'

export const COMPANIES_NO_RECENT_INTERACTIONS_LABEL =
  'Companies with no recent interactions'

export const COMPANIES_NEW_INTERACTIONS_LABEL =
  'Companies with new interactions'

export const MY_TASKS_DUE_DATE_APPROACHING_LABEL = 'Due date approaching'

export const TASK_ASSIGNED_TO_ME_FROM_OTHERS_LABEL =
  'Task assigned to me from others'

export const TASK_AMENDED_BY_OTHERS_LABEL = 'Task amended by others'

export const TASK_OVERDUE_LABEL = 'Task overdue'

export const TASK_COMPLETED_LABEL = 'Task completed'

export const REMINDERS_SETTINGS = [
  {
    id: INVESTMENTS_ESTIMATED_LAND_DATES,
    label: INVESTMENTS_ESTIMATED_LAND_DATES_LABEL,
    settingsQSParam: snakeCase(INVESTMENTS_ESTIMATED_LAND_DATES),
    url: urls.reminders.investments.estimatedLandDate(),
  },
  {
    id: INVESTMENTS_NO_RECENT_INTERACTIONS,
    label: INVESTMENTS_NO_RECENT_INTERACTIONS_LABEL,
    settingsQSParam: snakeCase(INVESTMENTS_NO_RECENT_INTERACTIONS),
    url: urls.reminders.investments.noRecentInteraction(),
  },
  {
    id: INVESTMENTS_OUTSTANDING_PROPOSITIONS,
    label: INVESTMENTS_OUTSTANDING_PROPOSITIONS_LABEL,
    settingsQSParam: snakeCase(INVESTMENTS_OUTSTANDING_PROPOSITIONS),
    url: urls.reminders.investments.outstandingPropositions(),
  },
  {
    id: COMPANIES_NO_RECENT_INTERACTIONS,
    label: COMPANIES_NO_RECENT_INTERACTIONS_LABEL,
    settingsQSParam: snakeCase(COMPANIES_NO_RECENT_INTERACTIONS),
    url: urls.reminders.exports.noRecentInteractions(),
  },
  {
    id: COMPANIES_NEW_INTERACTIONS,
    label: COMPANIES_NEW_INTERACTIONS_LABEL,
    settingsQSParam: snakeCase(COMPANIES_NEW_INTERACTIONS),
    url: urls.reminders.exports.newInteractions(),
  },
  {
    id: MY_TASKS_DUE_DATE_APPROACHING,
    label: MY_TASKS_DUE_DATE_APPROACHING_LABEL,
    settingsQSParam: snakeCase(MY_TASKS_DUE_DATE_APPROACHING),
    url: urls.reminders.myTasks.dueDateApproaching(),
  },
  {
    id: TASK_ASSIGNED_TO_ME_FROM_OTHERS,
    label: TASK_ASSIGNED_TO_ME_FROM_OTHERS_LABEL,
    settingsQSParam: snakeCase(TASK_ASSIGNED_TO_ME_FROM_OTHERS),
    url: urls.reminders.myTasks.taskAssignedToMeFromOthers(),
  },
  {
    id: TASK_AMENDED_BY_OTHERS,
    label: TASK_AMENDED_BY_OTHERS_LABEL,
    settingsQSParam: snakeCase(TASK_AMENDED_BY_OTHERS),
    url: urls.reminders.myTasks.taskAmendedByOthers(),
  },
  {
    id: TASK_OVERDUE,
    label: TASK_OVERDUE_LABEL,
    settingsQSParam: snakeCase(TASK_OVERDUE),
    url: urls.reminders.myTasks.taskOverdue(),
  },
  {
    id: TASK_COMPLETED,
    label: TASK_COMPLETED_LABEL,
    settingsQSParam: snakeCase(TASK_COMPLETED),
    url: urls.reminders.myTasks.taskCompleted(),
  },
]

export const reminderTypeToLabel = {
  [INVESTMENTS_ESTIMATED_LAND_DATES]: INVESTMENTS_ESTIMATED_LAND_DATES_LABEL,
  [INVESTMENTS_NO_RECENT_INTERACTIONS]:
    INVESTMENTS_NO_RECENT_INTERACTIONS_LABEL,
  [INVESTMENTS_OUTSTANDING_PROPOSITIONS]:
    INVESTMENTS_OUTSTANDING_PROPOSITIONS_LABEL,
  [COMPANIES_NO_RECENT_INTERACTIONS]: COMPANIES_NO_RECENT_INTERACTIONS_LABEL,
  [COMPANIES_NEW_INTERACTIONS]: COMPANIES_NEW_INTERACTIONS_LABEL,
  [MY_TASKS_DUE_DATE_APPROACHING]: MY_TASKS_DUE_DATE_APPROACHING_LABEL,
  [TASK_ASSIGNED_TO_ME_FROM_OTHERS]: TASK_ASSIGNED_TO_ME_FROM_OTHERS_LABEL,
  [TASK_AMENDED_BY_OTHERS]: TASK_AMENDED_BY_OTHERS_LABEL,
  [TASK_OVERDUE]: TASK_OVERDUE_LABEL,
  [TASK_COMPLETED]: TASK_COMPLETED_LABEL,
}

export const INTERACTION_NAMES = {
  interaction: 'Interaction',
  service_delivery: 'Service delivery',
  policy_feedback: 'Business intelligence',
}
