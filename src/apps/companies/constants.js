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
  key: 'datahub-crm',
  order: 1,
}

const DEPRECATED_LOCAL_NAV = [
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

const LOCAL_NAV = [
  {
    path: 'interactions',
    label: 'Interactions',
    permissions: [
      'interaction.view_all_interaction',
    ],
  },
  {
    path: 'contacts',
    label: 'Company contacts',
    permissions: [
      'company.view_contact',
    ],
  },
  {
    path: 'advisers',
    label: 'Core team',
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
    label: 'Orders',
    permissions: [
      'order.view_order',
    ],
  },
]

const APP_PERMISSIONS = concat(DEPRECATED_LOCAL_NAV, GLOBAL_NAV_ITEM)

const QUERY_FIELDS = [
  'archived',
  'name',
  'sector_descends',
  'country',
  'uk_region',
  'headquarter_type',
]

const NONE_TEXT = 'None'
const NOT_SET_TEXT = 'Not set'
const NOT_AVAILABLE_TEXT = 'Not available'

module.exports = {
  GLOBAL_NAV_ITEM,
  DEPRECATED_LOCAL_NAV,
  LOCAL_NAV,
  DEFAULT_COLLECTION_QUERY,
  APP_PERMISSIONS,
  QUERY_FIELDS,
  NONE_TEXT,
  NOT_SET_TEXT,
  NOT_AVAILABLE_TEXT,
}
