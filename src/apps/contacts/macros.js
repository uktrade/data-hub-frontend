const { assign, reject, merge } = require('lodash')

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
    },
  ],
}

const contactSortOptions = [
  { value: 'created_on:desc', label: 'Newest' },
  { value: 'created_on:asc', label: 'Oldest' },
  { value: 'modified_on:desc', label: 'Recently updated' },
  { value: 'modified_on:asc', label: 'Least recently updated' },
  { value: 'first_name:asc', label: 'First name: A-Z' },
  { value: 'first_name:desc', label: 'First name: Z-A' },
  { value: 'last_name:asc', label: 'Last name: A-Z' },
  { value: 'last_name:desc', label: 'Last name: Z-A' },
  { value: 'address_country.name:asc', label: 'Country: A-Z' },
  { value: 'address_country.name:desc', label: 'Country: Z-A' },
  { value: 'company.name:asc', label: 'Company: A-Z' },
  { value: 'company.name:desc', label: 'Company: Z-A' },
  { value: 'company_sector.name:asc', label: 'Sector: A-Z' },
  { value: 'company_sector.name:desc', label: 'Sector: Z-A' },
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
  assign({}, globalFields.sectors, {
    name: 'company_sector',
    initialOption: 'All sectors',
  }),
  assign({}, globalFields.countries, {
    name: 'address_country',
    initialOption: 'All countries',
  }),
  assign({}, globalFields.ukRegions, {
    name: 'company_uk_region',
    initialOption: 'All UK regions',
  }),
  {
    macroName: 'MultipleChoiceField',
    name: 'archived',
    type: 'checkbox',
    label: 'Status',
    options: [
      { value: 'false', label: 'Active' },
      { value: 'true', label: 'Inactive' },
    ],
  },
].map(filter => {
  return assign(filter, {
    modifier: ['smaller', 'light'],
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
