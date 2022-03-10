const { reject, merge } = require('lodash')

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
  contactSortForm,
  companyContactSortForm,
}
