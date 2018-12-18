const { concat } = require('lodash')

const DEFAULT_COLLECTION_QUERY = {
  sortby: 'modified_on:desc',
  archived: false,
}

const GLOBAL_NAV_ITEM = {
  path: '/companies',
  label: 'Companies',
  permissions: [
    'company.view_company',
  ],
  order: 1,
}

const LOCAL_NAV = [
  {
    path: 'details',
    label: 'Details',
  },
  {
    path: 'subsidiaries',
    label: 'Subsidiaries',
  },
  {
    path: 'contacts',
    label: 'Contacts',
    permissions: [
      'company.view_contact',
    ],
  },
  {
    path: 'advisers',
    label: 'Advisers',
  },
  {
    path: 'interactions',
    label: 'Interactions',
    permissions: [
      'interaction.view_all_interaction',
    ],
  },
  {
    path: 'investments',
    label: 'Investment',
    permissions: [
      'investment.view_all_investmentproject',
      'investment.view_associated_investmentproject',
    ],
  },
  {
    path: 'exports',
    label: 'Export',
  },
  {
    path: 'orders',
    label: 'Orders (OMIS)',
    permissions: [
      'order.view_order',
    ],
  },
  {
    path: 'timeline',
    label: 'Timeline',
    permissions: [
      'company.view_company_timeline',
    ],
  },
  {
    path: 'documents',
    label: 'Documents',
    permissions: [
      'company.view_company_document',
    ],
  },
  {
    path: 'audit',
    label: 'Audit history',
  },
]

const APP_PERMISSIONS = concat(LOCAL_NAV, GLOBAL_NAV_ITEM)

const QUERY_FIELDS = [
  'archived',
  'name',
  'sector_descends',
  'country',
  'uk_region',
  'headquarter_type',
]

const NONE_TEXT = 'None'

module.exports = {
  GLOBAL_NAV_ITEM,
  LOCAL_NAV,
  DEFAULT_COLLECTION_QUERY,
  APP_PERMISSIONS,
  QUERY_FIELDS,
  NONE_TEXT,
}
