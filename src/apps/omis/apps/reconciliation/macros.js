const { assign, filter, flatten, includes } = require('lodash')

const { ORDER_STATES } = require('../../constants')
const { collectionSortForm } = require('../list/macros')

const filtersFields = [
  {
    macroName: 'MultipleChoiceField',
    label: 'Order status',
    name: 'status',
    type: 'checkbox',
    modifier: 'option-select',
    options: filter(ORDER_STATES, (o) => {
      return !includes(['draft', 'quote_awaiting_acceptance'], o.value)
    }),
  },
  {
    macroName: 'TextField',
    label: 'Order reference',
    name: 'reference',
  },
  {
    macroName: 'TextField',
    label: 'Company name',
    name: 'company_name',
  },
  {
    macroName: 'TextField',
    label: 'Net amount',
    name: 'net_cost',
  },
  {
    macroName: 'TextField',
    label: 'Gross amount',
    name: 'total_cost',
  },
].map((filter) => {
  return assign({}, filter, {
    modifier: flatten([filter.modifier, 'smaller', 'light', 'filter']),
  })
})

const reconciliationSortForm = assign({}, collectionSortForm, {
  children: [
    {
      macroName: 'MultipleChoiceField',
      label: 'Sort by',
      name: 'sortby',
      modifier: ['small', 'inline', 'light'],
      options: [
        { value: 'payment_due_date:asc', label: 'Earliest payment due date' },
        { value: 'payment_due_date:desc', label: 'Latest payment due date' },
      ],
    },
  ],
})

module.exports = {
  reconciliationSortForm,
  filtersFields,
}
