export const LABELS = {
  kind: 'Interaction type',
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
  subSector: 'Sub-sector',
  businessIntelligence: 'Business intelligence',
  policyAreas: 'Policy areas',
  policyIssueType: 'Policy issue type',
  companyOneListGroupTier: 'Company One List group tier',
}

export const KIND_OPTIONS = [
  { label: LABELS.interaction, value: 'interaction' },
  { label: LABELS.serviceDelivery, value: 'service_delivery' },
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
