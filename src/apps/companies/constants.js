const { concat } = require('lodash')

const DEFAULT_COLLECTION_QUERY = {
  sortby: 'modified_on:desc',
  archived: false,
}

const GLOBAL_NAV_ITEM = {
  path: '/companies',
  label: 'Companies',
  permissions: [
    'company.read_company',
  ],
  order: 1,
}

const LOCAL_NAV = [
  {
    path: 'details',
    label: 'Details',
  },
  {
    path: 'contacts',
    label: 'Contacts',
    permissions: [
      'company.read_contact',
    ],
  },
  {
    path: 'interactions',
    label: 'Interactions',
    permissions: [
      'interaction.read_all_interaction',
    ],
  },
  {
    path: 'exports',
    label: 'Export',
  },
  {
    path: 'investments',
    label: 'Investment',
    permissions: [
      'investment.read_all_investmentproject',
      'investment.read_associated_investmentproject',
    ],
  },
  {
    path: 'orders',
    label: 'Orders (OMIS)',
    permissions: [
      'order.read_order',
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
      'company.read_company_document',
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
