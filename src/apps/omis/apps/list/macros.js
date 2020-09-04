const { flatten } = require('lodash')

const { ORDER_STATES } = require('../../constants')

const omisFiltersFields = function ({
  omisMarketOptions,
  regionOptions,
  sectorOptions,
  userAgent,
}) {
  return [
    {
      macroName: 'MultipleChoiceField',
      label: 'Order status',
      name: 'status',
      type: 'checkbox',
      modifier: 'option-select',
      options: ORDER_STATES,
    },
    {
      macroName: 'TextField',
      label: 'Order reference',
      name: 'reference',
    },
    {
      macroName: 'DateField',
      type: 'date',
      label: 'Completed date from',
      name: 'completed_on_after',
      hint: userAgent.isIE ? 'DD/MM/YYYY' : null,
      placeholder: '',
      inputClass: userAgent.isIE ? 'ie-date-field' : null,
    },
    {
      macroName: 'DateField',
      type: 'date',
      label: 'Completed date to',
      name: 'completed_on_before',
      hint: userAgent.isIE ? 'DD/MM/YYYY' : null,
      placeholder: '',
      inputClass: userAgent.isIE ? 'ie-date-field' : null,
    },
    {
      macroName: 'DateField',
      type: 'date',
      label: 'Expected delivery date from',
      name: 'delivery_date_after',
      hint: userAgent.isIE ? 'DD/MM/YYYY' : null,
      placeholder: '',
      inputClass: userAgent.isIE ? 'ie-date-field' : null,
    },
    {
      macroName: 'DateField',
      type: 'date',
      label: 'Expected delivery date to',
      name: 'delivery_date_before',
      hint: userAgent.isIE ? 'DD/MM/YYYY' : null,
      placeholder: '',
      inputClass: userAgent.isIE ? 'ie-date-field' : null,
    },
    {
      macroName: 'TextField',
      label: 'Company name',
      name: 'company_name',
    },
    {
      macroName: 'TextField',
      label: 'Contact name',
      name: 'contact_name',
    },
    {
      macroName: 'Typeahead',
      name: 'sector_descends',
      isAsync: false,
      placeholder: 'Search sector',
      useSubLabel: false,
      options: sectorOptions,
      hideInactive: false,
      target: 'metadata',
      label: 'Sector',
    },
    {
      macroName: 'Typeahead',
      name: 'primary_market',
      isAsync: false,
      placeholder: 'Search country',
      useSubLabel: false,
      options: omisMarketOptions,
      hideInactive: false,
      target: 'metadata',
      label: 'Market (country)',
    },
    {
      macroName: 'Typeahead',
      name: 'uk_region',
      isAsync: false,
      placeholder: 'Search UK region',
      useSubLabel: false,
      options: regionOptions,
      hideInactive: false,
      target: 'metadata',
      label: 'UK region',
    },
  ].map((filter) => {
    return {
      ...filter,
      modifier: flatten([filter.modifier, 'smaller', 'light', 'filter']),
    }
  })
}

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
      inputClass: 'js-MirrorValue',
      inputData: {
        'target-selector': '.c-collection-filters input[name="sortby"]',
      },
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

module.exports = {
  collectionSortForm,
  omisFiltersFields,
}
