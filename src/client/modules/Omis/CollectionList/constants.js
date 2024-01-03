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
  grossAmount: 'Gross amount',
  netAmount: 'Net amount',
}

export const SORT_OPTIONS = [
  { value: 'created_on:desc', name: 'Recently created' },
  { value: 'created_on:asc', name: 'Oldest' },
  { value: 'modified_on:desc', name: 'Recently updated' },
  { value: 'modified_on:asc', name: 'Least recently updated' },
  { value: 'delivery_date:asc', name: 'Earliest delivery date' },
  { value: 'delivery_date:desc', name: 'Latest delivery date' },
]

export const RECONCILIATION_SORT_OPTIONS = [
  { value: 'payment_due_date:asc', name: 'Earliest payment due date' },
  { value: 'payment_due_date:desc', name: 'Latest payment due date' },
]

const STATUS_QUOTE_ACCEPTED = {
  value: 'quote_accepted',
  label: 'Quote accepted',
}

const STATUS_PAID = {
  value: 'paid',
  label: 'Payment received',
}

const STATUS_COMPLETE = {
  value: 'complete',
  label: 'Completed',
}

const STATUS_CANCELLED = {
  value: 'cancelled',
  label: 'Cancelled',
}

export const STATUSES = [
  {
    value: 'draft',
    label: 'Draft',
  },
  {
    value: 'quote_awaiting_acceptance',
    label: 'Quote awaiting acceptance',
  },
  STATUS_QUOTE_ACCEPTED,
  STATUS_PAID,
  STATUS_COMPLETE,
  STATUS_CANCELLED,
]

export const RECONCILIATION_STATUSES = [
  STATUS_QUOTE_ACCEPTED,
  STATUS_PAID,
  STATUS_COMPLETE,
  STATUS_CANCELLED,
]
