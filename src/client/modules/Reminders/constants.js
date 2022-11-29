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

export const INVESTMENTS_ESTIMATED_LAND_DATE = 'investments-estimated-land-date'
export const INVESTMENTS_NO_RECENT_INTERACTION =
  'investments-no-recent-interaction'
export const INVESTMENTS_OUTSTANDING_PROPOSITIONS =
  'investments-outstanding-propositions'
export const EXPORTS_NO_RECENT_INTERACTION = 'exports-no-recent-interactions'

export const reminderTypeToLabel = {
  [INVESTMENTS_ESTIMATED_LAND_DATE]: 'Approaching estimated land dates',
  [INVESTMENTS_NO_RECENT_INTERACTION]: 'Projects with no recent interactions',
  [INVESTMENTS_OUTSTANDING_PROPOSITIONS]: 'Outstanding propositions',
  [EXPORTS_NO_RECENT_INTERACTION]: 'Companies with no recent interactions',
}
