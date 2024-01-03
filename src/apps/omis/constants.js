const GLOBAL_NAV_ITEM = {
  path: '/omis',
  headerKey: 'datahub-orders',
  permissions: ['order.view_order'],
  key: 'datahub-crm',
  order: 6,
}

const QUERY_DATE_FIELDS = [
  'completed_on_after',
  'completed_on_before',
  'delivery_date_before',
  'delivery_date_after',
]
const QUERY_FIELDS = [
  'status',
  'company_name',
  'contact_name',
  'primary_market',
  'uk_region',
  'reference',
  'total_cost',
  'net_cost',
  'sector_descends',
  ...QUERY_DATE_FIELDS,
]

const APP_PERMISSIONS = [GLOBAL_NAV_ITEM]

module.exports = {
  APP_PERMISSIONS,
  GLOBAL_NAV_ITEM,
  QUERY_FIELDS,
  QUERY_DATE_FIELDS,
}
