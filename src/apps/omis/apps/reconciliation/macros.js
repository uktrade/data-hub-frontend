const { assign, filter, includes } = require('lodash')

const { ORDER_STATES } = require('../../constants')
const { collectionSortForm } = require('../list/macros')

const filtersFields = [
  {
    macroName: 'MultipleChoiceField',
    label: 'Order status',
    name: 'status',
    type: 'radio',
    options: filter(ORDER_STATES, o => {
      return !includes(['draft', 'quote_awaiting_acceptance'], o.value)
    }),
  },
  {
    macroName: 'TextField',
    label: 'Order reference',
    name: 'reference',
    hint: 'At least three characters',
  },
  {
    macroName: 'TextField',
    label: 'Company name',
    name: 'company_name',
    hint: 'At least three characters',
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
].map(filter => {
  return assign({}, filter, {
    modifier: ['smaller', 'light'],
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
