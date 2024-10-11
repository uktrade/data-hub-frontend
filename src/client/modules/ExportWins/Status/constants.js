export const WIN_STATUS = {
  PENDING: null,
  CONFIRMED: true,
  REJECTED: false,
}

export const WIN_STATUS_MAP_TO_LABEL = {
  [WIN_STATUS.PENDING]: 'Pending',
  [WIN_STATUS.CONFIRMED]: 'Confirmed',
  [WIN_STATUS.REJECTED]: 'Rejected',
}

export const SORT_OPTIONS = [
  { name: 'Newest', value: '-created_on' },
  { name: 'Oldest', value: 'created_on' },
  { name: 'Company name A-Z', value: 'company__name' },
  { name: 'Company name Z-A', value: '-company__name' },
]

export const ADVISER_ROLES = {
  LEAD_OFFICER: 'lead officer',
  TEAM_MEMBER: 'team member',
  CONTRIBUTING_OFFICER: 'contributing officer',
}
