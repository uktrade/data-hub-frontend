const { assign, flatten, reject, merge } = require('lodash')

const { globalFields } = require('../macros')
const FILTER_CONSTANTS = require('../../lib/filter-constants')

const PRIMARY_SECTOR_NAME = FILTER_CONSTANTS.CONTACTS.SECTOR.PRIMARY.NAME

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

const contactFiltersFields = function ({ sectorOptions }) {
  return [
    {
      macroName: 'TextField',
      label: 'Contact name',
      name: 'name',
    },
    {
      macroName: 'TextField',
      label: 'Company name',
      name: 'company_name',
    },
    {
      macroName: 'Typeahead',
      name: PRIMARY_SECTOR_NAME,
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
      name: 'address_country',
      isAsync: false,
      placeholder: 'Search country',
      useSubLabel: false,
      options: globalFields.countries.options(),
      hideInactive: false,
      target: 'metadata',
      label: 'Country',
    },
    {
      macroName: 'Typeahead',
      name: 'company_uk_region',
      isAsync: false,
      placeholder: 'Search UK region',
      useSubLabel: false,
      options: globalFields.ukRegions.options(),
      hideInactive: false,
      target: 'metadata',
      label: 'UK region',
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
  ].map((filter) => {
    return assign(filter, {
      modifier: flatten([filter.modifier, 'smaller', 'light', 'filter']),
    })
  })
}

const contactSortForm = merge({}, sortFormBase, {
  children: [{ options: contactSortOptions }],
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
