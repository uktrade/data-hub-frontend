export const LABELS = {
  status: 'Order status',
  sector: 'Sector',
  ukRegion: 'UK region',
  reference: 'Order reference',
  primaryMarket: 'Market (country)',
  contactName: 'Contact name',
  companyName: 'Company name',
  completedOnAfter: 'Completed date from',
  completedOnBefore: 'Completed date to',
  deliveryDateAfter: 'Expected delivery date from',
  deliveryDateBefore: 'Expected delivery date to',
}

export const SORT_OPTIONS = [
  { value: 'created_on:desc', name: 'Recently created' },
  { value: 'created_on:asc', name: 'Oldest' },
  { value: 'modified_on:desc', name: 'Recently updated' },
  { value: 'modified_on:asc', name: 'Least recently updated' },
  { value: 'delivery_date:asc', name: 'Earliest delivery date' },
  { value: 'delivery_date:desc', name: 'Latest delivery date' },
]

export const STATUSES = [
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
