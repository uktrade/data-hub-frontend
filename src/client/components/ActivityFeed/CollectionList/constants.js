export const LABELS = {
  kind: 'Activity types',
  interaction: 'Interaction',
  serviceDelivery: 'Service delivery',
  advisers: 'Adviser',
  company: 'Company',
  subject: 'Subject',
  myInteractions: 'My interactions',
  dateAfter: 'From',
  dateBefore: 'To',
  service: 'Service',
  teams: 'Teams',
  sector: 'Sector',
  businessIntelligence: 'Business intelligence',
  policyAreas: 'Policy areas',
  policyIssueType: 'Policy issue type',
  companyOneListGroupTier: 'Company One List group tier',
  allDataHubActivity: 'All Data Hub activity',
  myActivity: 'My activity',
  allExternalActivity: 'All external activity',
}

export const KIND_OPTIONS = [
  { label: LABELS.allDataHubActivity, value: 'all_data_hub_activity' },
  { label: LABELS.myActivity, value: 'my_activity' },
  { label: LABELS.allExternalActivity, value: 'all_external_activity' },
]

export const BUSINESS_INTELLIGENCE_OPTION = [
  {
    label: 'Includes business intelligence',
    value: 'true',
  },
]

export const SORT_OPTIONS = [
  { value: 'date:desc', name: 'Recently created' },
  { value: 'company.name', name: 'Company name A-Z' },
  { value: 'subject', name: 'Subject A-Z' },
]
