const { concat } = require('lodash')

const GLOBAL_NAV_ITEM = {
  path: '/investment-projects',
  label: 'Investment projects',
  permissions: [
    'investment.read_associated_investmentproject',
    'investment.read_all_investmentproject',
  ],
  order: 5,
}

const LOCAL_NAV = [
  {
    path: 'details',
    label: 'Project details',
  },
  {
    path: 'team',
    label: 'Project team',
  },
  {
    path: 'interactions',
    label: 'Interactions',
    permissions: [
      'interaction.read_associated_investmentproject_interaction',
      'interaction.read_all_interaction',
    ],
  },
  {
    path: 'propositions',
    label: 'Propositions',
    // permissions: [
    //   'proposition.read_associated_investmentproject_propositions',
      // 'proposition.read_all_proposition',
    // ],
  },
  {
    path: 'evaluation',
    label: 'Evaluations',
  },
  {
    path: 'audit',
    label: 'Audit history',
  },
  {
    path: 'documents',
    label: 'Documents',
    permissions: [
      'investment.read_investmentproject_document',
    ],
  },
]

const DEFAULT_COLLECTION_QUERY = {
  sortby: 'estimated_land_date:asc',
}

const APP_PERMISSIONS = concat(LOCAL_NAV, GLOBAL_NAV_ITEM)

module.exports = {
  GLOBAL_NAV_ITEM,
  LOCAL_NAV,
  DEFAULT_COLLECTION_QUERY,
  APP_PERMISSIONS,
}
