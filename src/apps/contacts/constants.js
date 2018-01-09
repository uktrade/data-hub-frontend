const { concat } = require('lodash')

const DEFAULT_COLLECTION_QUERY = {
  sortby: 'modified_on:desc',
  archived: false,
}

const GLOBAL_NAV_ITEM = {
  path: '/contacts',
  label: 'Contacts',
  permissions: [
    'company.read_contact',
  ],
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
    permissions: [
      'interaction.read_all_interaction',
    ],
  },
  {
    path: 'audit',
    label: 'Audit history',
  },
  {
    path: 'documents',
    label: 'Documents',
    permissions: [
      'company.read_contact_document',
    ],
  },
]

const APP_PERMISSIONS = concat(LOCAL_NAV, GLOBAL_NAV_ITEM)

module.exports = {
  GLOBAL_NAV_ITEM,
  LOCAL_NAV,
  DEFAULT_COLLECTION_QUERY,
  APP_PERMISSIONS,
}
