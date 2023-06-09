export const SORT_OPTIONS = [
  {
    label: 'Recently created',
    value: 'created_on:desc',
  },
  {
    label: 'Export title A-Z',
    value: 'title',
  },
  {
    label: 'Export title Z-A',
    value: '-title',
  },
]

export const EXPORT_POTENTIAL_OPTIONS = [
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
]

export const STATUS_OPTIONS = [
  { label: 'Active', value: 'active' },
  { label: 'Won', value: 'won' },
  { label: 'Inactive', value: 'inactive' },
]

export const SHOW_ALL_OPTION = {
  label: 'Show all',
  value: 'all-statuses',
}

export const EXPORT_POTENTIAL_LIST_OPTIONS = [
  SHOW_ALL_OPTION,
  ...EXPORT_POTENTIAL_OPTIONS,
]

export const STATUS_LIST_OPTIONS = [SHOW_ALL_OPTION, ...STATUS_OPTIONS]
