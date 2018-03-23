const { assign, flatten, reject, merge } = require('lodash')

const { globalFields } = require('../macros')

const sortFormBase = {
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
    },
  ],
}

const contactSortOptions = [
  { value: 'created_on:desc', label: 'Newest' },
  { value: 'created_on:asc', label: 'Oldest' },
  { value: 'modified_on:desc', label: 'Recently updated' },
  { value: 'modified_on:asc', label: 'Least recently updated' },
  { value: 'last_name:asc', label: 'Last name: A-Z' },
  { value: 'address_country.name:asc', label: 'Country: A-Z' },
  { value: 'company.name:asc', label: 'Company: A-Z' },
]

const contactFiltersFields = [
  {
    macroName: 'TextField',
    label: 'Contact name',
    name: 'name',
    hint: 'At least three characters',
  },
  {
    macroName: 'TextField',
    label: 'Company name',
    name: 'company_name',
    hint: 'At least three characters',
  },
  {
    macroName: 'MultipleChoiceField',
    name: 'archived',
    type: 'checkbox',
    label: 'Status',
    options: [
      { value: 'false', label: 'Active' },
      { value: 'true', label: 'Inactive' },
    ],
    modifier: 'option-select',
  },
  assign({}, globalFields.sectors, {
    name: 'company_sector',
    type: 'checkbox',
    modifier: 'option-select',
  }),
  assign({}, globalFields.countries, {
    name: 'address_country',
    type: 'checkbox',
    modifier: 'option-select',
  }),
  assign({}, globalFields.ukRegions, {
    name: 'company_uk_region',
    type: 'checkbox',
    modifier: 'option-select',
  }),

].map(filter => {
  return assign(filter, {
    modifier: flatten([filter.modifier, 'smaller', 'light', 'filter']),
  })
})

const contactSortForm = merge({}, sortFormBase, {
  children: [
    { options: contactSortOptions },
  ],
})

const companyContactSortForm = merge({}, sortFormBase, {
  children: [
    {
      options: reject(contactSortOptions, (option) => {
        return option.value.includes('company.name:')
      }),
    },
  ],
})

module.exports = {
  contactFiltersFields,
  contactSortForm,
  companyContactSortForm,
}
