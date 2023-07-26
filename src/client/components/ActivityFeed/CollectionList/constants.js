import { FILTER_KEYS } from '../../../../apps/companies/apps/activity-feed/constants'

export const LABELS = {
  activityType: 'Activity type',
  interaction: 'Interaction',
  serviceDelivery: 'Service delivery',
  advisers: 'Adviser',
  company: 'Company',
  subject: 'Subject',
  createdBy: 'Created by',
  me: 'Me',
  others: 'Others',

  dateAfter: 'From',
  dateBefore: 'To',
  service: 'Service',
  teams: 'Teams',
  sector: 'Sector',
  businessIntelligence: 'Business intelligence',
  policyAreas: 'Policy areas',
  policyIssueType: 'Policy issue type',
  companyOneListGroupTier: 'Company One List group tier',
  allDataHubActivity: 'Internal activity',
  myActivity: 'My activity',
  allExternalActivity: 'External activity',
}

export const ACTIVITY_TYPE_OPTIONS = [
  { label: LABELS.allDataHubActivity, value: FILTER_KEYS.dataHubActivity },
  { label: LABELS.allExternalActivity, value: FILTER_KEYS.externalActivity },
]

export const BUSINESS_INTELLIGENCE_OPTION = [
  {
    label: 'Includes business intelligence',
    value: 'true',
  },
]

export const SORT_OPTIONS = [
  { value: 'date:desc', name: 'Recently created' },
  { value: 'date:asc', name: 'Oldest first' },
]
