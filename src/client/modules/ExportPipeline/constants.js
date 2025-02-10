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
  {
    label: 'Company name A-Z',
    value: 'company__name',
  },
  {
    label: 'Company name Z-A',
    value: '-company__name',
  },
  {
    label: 'Earliest expected date for win',
    value: 'estimated_win_date',
  },
  {
    label: 'Latest expected date for win',
    value: '-estimated_win_date',
  },

  {
    label: 'Value increasing',
    value: 'estimated_export_value_amount',
  },
  {
    label: 'Value decreasing',
    value: '-estimated_export_value_amount',
  },
]

export const SORT_OPTIONS_EXPORT_INTERACTION = [
  { name: 'Recently created', value: '-created_on' },
  { name: 'Company name A-Z', value: 'company__name' },
  { name: 'Subject A-Z', value: 'subject' },
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
