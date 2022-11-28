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
  [INVESTMENTS_ESTIMATED_LAND_DATE]: 'approaching estimated land dates',
  [INVESTMENTS_NO_RECENT_INTERACTION]: 'projects with no recent interaction',
  [INVESTMENTS_OUTSTANDING_PROPOSITIONS]: 'outstanding propositions',
  [EXPORTS_NO_RECENT_INTERACTION]: 'companies with no recent interactions',
}
