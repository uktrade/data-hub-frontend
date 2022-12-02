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

export const reminderTypeToLabel = {
  [INVESTMENTS_ESTIMATED_LAND_DATES]: 'Approaching estimated land dates',
  [INVESTMENTS_NO_RECENT_INTERACTIONS]: 'Projects with no recent interactions',
  [INVESTMENTS_OUTSTANDING_PROPOSITIONS]: 'Outstanding propositions',
  [COMPANIES_NO_RECENT_INTERACTIONS]: 'Companies with no recent interactions',
}
