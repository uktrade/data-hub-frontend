const GLOBAL_NAV_ITEM = {
  path: '/omis',
  label: 'Orders (OMIS)',
  permissions: [
    'order.view_order',
  ],
  key: 'datahub-crm',
  order: 6,
}

const ORDER_STATES = [
  {
    value: 'draft',
    label: 'Draft',
  },
  {
    value: 'quote_awaiting_acceptance',
    label: 'Quote awaiting acceptance',
  },
  {
    value: 'quote_accepted',
    label: 'Quote accepted',
  },
  {
    value: 'paid',
    label: 'Payment received',
  },
  {
    value: 'complete',
    label: 'Completed',
  },
  {
    value: 'cancelled',
    label: 'Cancelled',
  },
]

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

const APP_PERMISSIONS = [ GLOBAL_NAV_ITEM ]

module.exports = {
  APP_PERMISSIONS,
  GLOBAL_NAV_ITEM,
  ORDER_STATES,
  QUERY_FIELDS,
  QUERY_DATE_FIELDS,
}
