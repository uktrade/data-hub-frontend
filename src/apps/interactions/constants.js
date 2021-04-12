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
  'company_one_list_group_tier',
  'has_related_trade_agreements',
  'related_trade_agreements',
]

const QUERY_DATE_FIELDS = ['date_after', 'date_before']

const APP_PERMISSIONS = [GLOBAL_NAV_ITEM]

const INTERACTION_NAMES = {
  interaction: 'Interaction',
  service_delivery: 'Service delivery',
  policy_feedback: 'Business intelligence',
}

const SERVICE_DELIVERY_STATUS_COMPLETED = '47329c18-6095-e211-a939-e4115bead28a'

const TRADE_AGREEMENT_IMPLEMENTATION_ACTIVITY =
  'Trade Agreement Implementation Activity'

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
  TRADE_AGREEMENT: 'trade_agreement',
  OTHER: 'other',
}

const KINDS = {
  INTERACTION: 'interaction',
  SERVICE_DELIVERY: 'service_delivery',
}

const SERVICE_CONTEXTS = {
  INVESTMENT_PROJECT_INTERACTION: 'investment_project_interaction',
  EXPORT_SERVICE_DELIVERY: 'export_service_delivery',
  INTERACTION: 'interaction',
  EVENT: 'event', // Not interaction context
  OTHER_SERVICE_DELIVERY: 'other_service_delivery',
  INVESTMENT_INTERACTION: 'investment_interaction',
  EXPORT_INTERACTION: 'export_interaction',
  OTHER_INTERACTION: 'other_interaction',
  TRADE_AGREEMENT_INTERACTION: 'trade_agreement_interaction',
}

module.exports = {
  QUERY_FIELDS,
  QUERY_DATE_FIELDS,
  APP_PERMISSIONS,
  DEFAULT_COLLECTION_QUERY,
  GLOBAL_NAV_ITEM,
  INTERACTION_NAMES,
  SERVICE_DELIVERY_STATUS_COMPLETED,
  TRADE_AGREEMENT_IMPLEMENTATION_ACTIVITY,
  INTERACTION_STATUS,
  ARCHIVED_REASON,
  THEMES,
  KINDS,
  SERVICE_CONTEXTS,
}
