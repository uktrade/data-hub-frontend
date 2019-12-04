const DEFAULT_COLLECTION_QUERY = {
  sortby: 'date:desc',
}

const GLOBAL_NAV_ITEM = {
  path: '/interactions',
  headerKey: 'datahub-interactions',
  permissions: ['interaction.view_all_interaction'],
  key: 'datahub-crm',
  order: 4,
}

const QUERY_FIELDS = [
  'kind',
  'sector_descends',
  'communication_channel',
  'sortby',
  'dit_participants__team',
  'service',
  'was_policy_feedback_provided',
  'policy_areas',
  'policy_issue_types',
  'dit_participants__adviser',
]

const QUERY_DATE_FIELDS = ['date_after', 'date_before']

const APP_PERMISSIONS = [GLOBAL_NAV_ITEM]

const INTERACTION_NAMES = {
  interaction: 'Interaction',
  service_delivery: 'Service delivery',
  policy_feedback: 'Policy feedback',
}

const SERVICE_DELIVERY_STATUS_COMPLETED = '47329c18-6095-e211-a939-e4115bead28a'

const IST_ONLY_SERVICES = [
  {
    name: 'Investment - IST Aftercare (IST use only)',
    id: 'bd3d1be3-f9f7-e511-888e-e4115bead28a',
  },
  {
    name: 'IST Client Proposal (IST use only)',
    id: 'd03cce05-f9f7-e511-888e-e4115bead28a',
  },
  {
    name: 'IST Visit (IST use only)',
    id: '42c71892-f9f7-e511-888e-e4115bead28a',
  },
  {
    name: 'Investment Enquiry - Assigned to HQ (IST use only)',
    id: '38a67092-f485-4ea1-8a1a-402b949d2d13',
  },
  {
    name: 'Investment Enquiry - Assigned to IST-CMC (IST use only)',
    id: '2591b204-8a31-4824-a93b-d7a03dca8cb5',
  },
  {
    name: 'Investment Enquiry - Assigned to IST-SAS (IST use only)',
    id: 'c579b89b-d49d-4926-a6a4-0a1459cd25cb',
  },
  {
    name:
      'Investment Enquiry - Confirmed prospect project status (IST use only)',
    id: '4f142041-2b9d-4776-ace8-22612260eae6',
  },
  {
    name:
      'Investment Enquiry - Requested more information from source (IST use only)',
    id: '73ceedc1-c139-4bdf-9e47-17b1bae488da',
  },
  {
    name: 'Investment Enquiry - Transferred to DA (IST use only)',
    id: '05c8175a-abf5-4cc6-af34-bcee8699fd4b',
  },
  {
    name: 'Investment Enquiry - Transferred to L&P (IST use only)',
    id: 'c707f81d-ae66-490a-98f5-575438944c43',
  },
  {
    name: 'Investment Enquiry - Transferred to LEP (IST use only)',
    id: '48e6bc3e-56c5-4bdc-a718-093614547d73',
  },
  {
    name: 'Investment - IST Aftercare Offered (IST use only)',
    id: '79824229-fd87-483f-b929-8f2b9531492b',
  },
]

const INTERACTION_CONTEXTS = [
  'export_service_delivery',
  'export_interaction',
  'investment_interaction',
  'other_service_delivery',
  'other_interaction',
  'investment_project_interaction',
]

const INTERACTION_STATUS = {
  DRAFT: 'draft',
  COMPLETE: 'complete',
}

const ARCHIVED_REASON = {
  RESCHEDULED: 'Rescheduled',
}

const THEMES = {
  EXPORT: 'export',
  INVESTMENT: 'investment',
  OTHER: 'other',
}

const KINDS = {
  INTERACTION: 'interaction',
  SERVICE_DELIVERY: 'service-delivery',
}

module.exports = {
  QUERY_FIELDS,
  QUERY_DATE_FIELDS,
  APP_PERMISSIONS,
  DEFAULT_COLLECTION_QUERY,
  GLOBAL_NAV_ITEM,
  INTERACTION_NAMES,
  IST_ONLY_SERVICES,
  SERVICE_DELIVERY_STATUS_COMPLETED,
  INTERACTION_STATUS,
  ARCHIVED_REASON,
  INTERACTION_CONTEXTS,
  THEMES,
  KINDS,
}
