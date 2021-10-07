const { concat } = require('lodash')

const GLOBAL_NAV_ITEM = {
  path: '/contacts',
  headerKey: 'datahub-contacts',
  permissions: ['company.view_contact'],
  key: 'datahub-crm',
  order: 2,
}

const LOCAL_NAV = [
  {
    path: 'details',
    label: 'Details',
  },
  {
    path: 'interactions',
    label: 'Interactions',
    permissions: ['interaction.view_all_interaction'],
  },
  {
    path: 'audit',
    label: 'Audit history',
  },
  {
    path: 'documents',
    label: 'Documents',
    permissions: ['company.view_contact_document'],
  },
]

const APP_PERMISSIONS = concat(LOCAL_NAV, GLOBAL_NAV_ITEM)

const QUERY_FIELDS = [
  'archived',
  'name',
  'company_name',
  'company_sector_descends',
  'address_country',
  'company_uk_region',
]

module.exports = {
  GLOBAL_NAV_ITEM,
  LOCAL_NAV,
  APP_PERMISSIONS,
  QUERY_FIELDS,
}
