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
    label: 'Paid',
  },
  {
    value: 'complete',
    label: 'Complete',
  },
  {
    value: 'cancelled',
    label: 'Cancelled',
  },
]

module.exports = {
  ORDER_STATES,
}
