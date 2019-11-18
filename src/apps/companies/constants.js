const { concat } = require('lodash')

const QUERY_FIELDS_MAP = {
  archived: 'archived',
  name: 'name',
  sectorDescends: 'sector_descends',
  country: 'country',
  ukRegion: 'uk_region',
  headquarterType: 'headquarter_type',
  exportingTo: 'export_to_countries',
  interestedIn: 'future_interest_countries',
  lastInteractionDate: 'interaction_between',
}

const DEFAULT_COLLECTION_QUERY = {
  sortby: 'modified_on:desc',
  [QUERY_FIELDS_MAP.archived]: false,
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
    label: 'Lead adviser',
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

const ACTIVITY_TYPE = {
  CompaniesHouseAccount: ['dit:Accounts'],
  CompaniesHouseCompany: ['dit:Company'],
  HmrcExporter: ['dit:Export'],
  Interaction: ['dit:Interaction', 'dit:ServiceDelivery'],
  InvestmentProject: ['dit:InvestmentProject'],
  Omis: ['dit:OMISOrder'],
}

const ACTIVITY_TYPE_FILTERS = {
  allActivity: {
    label: 'All Data Hub & external activity',
    value: 'all',
  },

  myActivity: {
    label: 'My activity',
    value: 'my-activity',
  },

  externalActivity: {
    label: 'All external activity',
    value: 'external-activity',
  },

  dataHubActivity: {
    label: 'All Data Hub activity',
    value: 'datahub-activity',
  },
}

const ACTIVITY_TYPE_FILTER_OBJECT = {
  TYPE: 'object.type',
  ATTRIBUTED_TO_ID: 'object.attributedTo.id',
}

const ACTIVITY_TYPE_FILTER_KEYS = {
  allActivity: [].concat(
    ...[
      ACTIVITY_TYPE.CompaniesHouseAccount,
      ACTIVITY_TYPE.CompaniesHouseCompany,
      ACTIVITY_TYPE.HmrcExporter,
      ACTIVITY_TYPE.Interaction,
      ACTIVITY_TYPE.InvestmentProject,
      ACTIVITY_TYPE.Omis,
    ]
  ),

  externalActivity: [].concat(
    ...[
      ACTIVITY_TYPE.CompaniesHouseAccount,
      ACTIVITY_TYPE.CompaniesHouseCompany,
      ACTIVITY_TYPE.HmrcExporter,
    ]
  ),

  dataHubActivity: [].concat(
    ...[
      ACTIVITY_TYPE.Interaction,
      ACTIVITY_TYPE.InvestmentProject,
      ACTIVITY_TYPE.Omis,
    ]
  ),
}

const APP_PERMISSIONS = concat(LOCAL_NAV, GLOBAL_NAV_ITEM)
const QUERY_FIELDS = Object.values(QUERY_FIELDS_MAP)
const NONE_TEXT = 'None'
const NOT_SET_TEXT = 'Not set'
const NOT_AVAILABLE_TEXT = 'Not available'

module.exports = {
  ACTIVITY_TYPE,
  ACTIVITY_TYPE_FILTERS,
  ACTIVITY_TYPE_FILTER_KEYS,
  ACTIVITY_TYPE_FILTER_OBJECT,
  GLOBAL_NAV_ITEM,
  LOCAL_NAV,
  DEFAULT_COLLECTION_QUERY,
  APP_PERMISSIONS,
  QUERY_FIELDS,
  QUERY_FIELDS_MAP,
  NONE_TEXT,
  NOT_SET_TEXT,
  NOT_AVAILABLE_TEXT,
}
