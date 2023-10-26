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

export const reminderTypeToLabel = {
  [INVESTMENTS_ESTIMATED_LAND_DATES]: INVESTMENTS_ESTIMATED_LAND_DATES_LABEL,
  [INVESTMENTS_NO_RECENT_INTERACTIONS]:
    INVESTMENTS_NO_RECENT_INTERACTIONS_LABEL,
  [INVESTMENTS_OUTSTANDING_PROPOSITIONS]:
    INVESTMENTS_OUTSTANDING_PROPOSITIONS_LABEL,
  [COMPANIES_NO_RECENT_INTERACTIONS]: COMPANIES_NO_RECENT_INTERACTIONS_LABEL,
  [COMPANIES_NEW_INTERACTIONS]: COMPANIES_NEW_INTERACTIONS_LABEL,
  [MY_TASKS_DUE_DATE_APPROACHING]: MY_TASKS_DUE_DATE_APPROACHING_LABEL,
}

export const INTERACTION_NAMES = {
  interaction: 'Interaction',
  service_delivery: 'Service delivery',
  policy_feedback: 'Business intelligence',
}
