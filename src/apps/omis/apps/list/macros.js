const { assign, filter, flatten, includes } = require('lodash')

const { ORDER_STATES } = require('../../constants')
const metadataRepo = require('../../../../lib/metadata')
const { transformObjectToOption } = require('../../../transformers')

const filterFields = [
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
]

const collectionFiltersFields = flatten([
  [{
    macroName: 'MultipleChoiceField',
    label: 'Order status',
    name: 'status',
    type: 'radio',
    options: ORDER_STATES,
  }],
  filterFields,
  [{
    macroName: 'TextField',
    label: 'Contact name',
    name: 'contact_name',
    hint: 'At least three characters',
  },
  {
    macroName: 'MultipleChoiceField',
    label: 'Market (country)',
    name: 'primary_market',
    initialOption: 'All countries',
    options () {
      return metadataRepo.omisMarketOptions.map(transformObjectToOption)
    },
  },
  {
    macroName: 'MultipleChoiceField',
    label: 'UK region',
    name: 'uk_region',
    initialOption: 'All regions',
    options () {
      return metadataRepo.regionOptions.map(transformObjectToOption)
    },
  }],
]).map(filter => {
  return assign({}, filter, {
    modifier: ['smaller', 'light'],
  })
})

const reconciliationFiltersFields = flatten([
  [{
    macroName: 'MultipleChoiceField',
    label: 'Order status',
    name: 'status',
    type: 'radio',
    options: filter(ORDER_STATES, o => {
      return !includes(['draft', 'quote_awaiting_acceptance'], o.value)
    }),
  }],
  filterFields,
  [{
    macroName: 'TextField',
    label: 'Net amount',
    name: 'net_cost',
  },
  {
    macroName: 'TextField',
    label: 'Gross amount',
    name: 'total_cost',
  }],
]).map(filter => {
  return assign({}, filter, {
    modifier: ['smaller', 'light'],
  })
})

const collectionSortForm = {
  method: 'get',
  class: 'c-collection__sort-form js-AutoSubmit',
  hideFormActions: true,
  hiddenFields: { custom: true },
  children: [
    {
      macroName: 'MultipleChoiceField',
      label: 'Sort by',
      name: 'sortby',
      modifier: ['small', 'inline', 'light'],
      options: [
        { value: 'created_on:desc', label: 'Newest' },
        { value: 'created_on:asc', label: 'Oldest' },
        { value: 'modified_on:desc', label: 'Recently updated' },
        { value: 'modified_on:asc', label: 'Least recently updated' },
        { value: 'delivery_date:asc', label: 'Earliest delivery date' },
        { value: 'delivery_date:desc', label: 'Latest delivery date' },
      ],
    },
  ],
}

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
  collectionSortForm,
  collectionFiltersFields,
  reconciliationSortForm,
  reconciliationFiltersFields,
}
