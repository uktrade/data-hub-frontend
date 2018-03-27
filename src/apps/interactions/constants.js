const DEFAULT_COLLECTION_QUERY = {
  sortby: 'date:desc',
}

const GLOBAL_NAV_ITEM = {
  path: '/interactions',
  label: 'Interactions and services',
  permissions: [
    'interaction.read_all_interaction',
  ],
  order: 4,
}

const APP_PERMISSIONS = [ GLOBAL_NAV_ITEM ]

const INTERACTION_NAMES = {
  policy_feedback: 'Policy feedback',
  interaction: 'Interaction',
  service_delivery: 'Service delivery',
}

module.exports = {
  GLOBAL_NAV_ITEM,
  DEFAULT_COLLECTION_QUERY,
  APP_PERMISSIONS,
  INTERACTION_NAMES,
}
