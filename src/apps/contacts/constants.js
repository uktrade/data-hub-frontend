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
]

const APP_PERMISSIONS = [LOCAL_NAV, GLOBAL_NAV_ITEM]

const QUERY_FIELDS = [
  'archived',
  'name',
  'company_name',
  'company_sector_descends',
  'address_country',
  'company_uk_region',
]

const EMAIL_CONSENT_YES = 'Can be marketed to'
const EMAIL_CONSENT_NO = 'Cannot be marketed to'

const LEFT_COMPANY_OPTION = 'Left the company'
const NO_CONTACT_OPTION = 'Does not want to be contacted'
const ROLE_CHANGE_OPTION = 'Changed role/responsibility'

module.exports = {
  GLOBAL_NAV_ITEM,
  LOCAL_NAV,
  APP_PERMISSIONS,
  QUERY_FIELDS,
  EMAIL_CONSENT_YES,
  EMAIL_CONSENT_NO,
  LEFT_COMPANY_OPTION,
  NO_CONTACT_OPTION,
  ROLE_CHANGE_OPTION,
}
