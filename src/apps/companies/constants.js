const { concat } = require('lodash')

const DEFAULT_COLLECTION_QUERY = {
  sortby: 'modified_on:desc',
  archived: false,
}

const GLOBAL_NAV_ITEM = {
  path: '/companies',
  headerKey: 'datahub-companies',
  permissions: [
    'company.view_company',
  ],
  key: 'datahub-crm',
  order: 1,
}

const LOCAL_NAV = [
  {
    path: 'activity',
    label: 'Activity',
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
const NOT_SET_TEXT = 'Not set'
const NOT_AVAILABLE_TEXT = 'Not available'

module.exports = {
  GLOBAL_NAV_ITEM,
  LOCAL_NAV,
  DEFAULT_COLLECTION_QUERY,
  APP_PERMISSIONS,
  QUERY_FIELDS,
  NONE_TEXT,
  NOT_SET_TEXT,
  NOT_AVAILABLE_TEXT,
}
