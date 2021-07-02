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
}

export const KIND_OPTIONS = [
  { label: LABELS.interaction, value: 'interaction' },
  { label: LABELS.serviceDelivery, value: 'service_delivery' },
]

export const SORT_OPTIONS = [
  { value: 'date:desc', name: 'Recently created' },
  { value: 'subject', name: 'Subject A-Z' },
]
