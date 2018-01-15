const GLOBAL_NAV_ITEM = {
  path: '/omis',
  label: 'Orders (OMIS)',
  permissions: [
    'order.read_order',
  ],
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

const APP_PERMISSIONS = [ GLOBAL_NAV_ITEM ]

module.exports = {
  GLOBAL_NAV_ITEM,
  ORDER_STATES,
  APP_PERMISSIONS,
}
