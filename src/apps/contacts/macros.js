/* eslint camelcase: 0 */
const { assign, flatten, reject, merge, get } = require('lodash')

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

const contactFiltersFields = function ({
  company_sector,
  address_country,
  active,
} = {}) {
  return [
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
      type: 'checkbox',
      modifier: 'option-select',
      options: company_sector,
    }),
    assign({}, globalFields.countries, {
      name: 'address_country',
      type: 'checkbox',
      modifier: 'option-select',
      options: address_country,
    }),
    {
      macroName: 'MultipleChoiceField',
      name: 'archived',
      type: 'checkbox',
      label: 'Status',
      options: active,
      modifier: 'option-select',
    }]
    .map(filter => {
      return assign(filter, {
        modifier: flatten([filter.modifier, 'smaller', 'light', 'filter']),
      })
    })
    .filter(filter => {
      if (filter.macroName === 'MultipleChoiceField' &&
          filter.name !== 'created_by' &&
          get(filter, 'options', []).length < 2
      ) {
        return false
      }
      return true
    })
}

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
