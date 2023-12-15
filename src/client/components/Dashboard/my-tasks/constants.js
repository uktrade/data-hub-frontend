export const ASSIGNED_TO_OPTIONS = [
  {
    label: 'Me',
    value: 'me',
  },
  {
    label: 'Others',
    value: 'others',
  },
]

export const CREATED_BY_OPTIONS = [
  {
    label: 'Me',
    value: 'me',
  },
  {
    label: 'Others',
    value: 'others',
  },
]

export const SORT_BY_LIST_OPTIONS = [
  {
    label: 'Due date',
    value: 'due_date',
  },
  {
    label: 'Recently updated',
    value: 'recently_updated',
  },
  {
    label: 'Least recently updated',
    value: 'least_recently_updated',
  },
  {
    label: 'Company A-Z',
    value: 'company_ascending',
  },
  {
    label: 'Project A-Z',
    value: 'project_ascending',
  },
]

export const SHOW_ALL_OPTION = {
  label: 'Show all',
  value: 'all-statuses',
}

export const CREATED_BY_LIST_OPTIONS = [SHOW_ALL_OPTION, ...CREATED_BY_OPTIONS]

export const ASSIGNED_TO_LIST_OPTIONS = [
  SHOW_ALL_OPTION,
  ...ASSIGNED_TO_OPTIONS,
]
