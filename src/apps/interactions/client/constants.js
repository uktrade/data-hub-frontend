export const LABELS = {
  kind: 'Kind',
  interaction: 'Interaction',
  serviceDelivery: 'Service delivery',
  advisers: 'Advisers',
  myInteractions: 'My interactions',
  dateAfter: 'From',
  dateBefore: 'To',
  service: 'Service',
  sector: 'Sector',
  businessIntelligence: 'Business intelligence',
  policyAreas: 'Policy area(s)',
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
  { value: 'subject', name: 'Subject A-Z' },
]
