const { globalFields } = require('../macros')

const companyFiltersFields = [
  {
    macroName: 'TextField',
    label: 'Company name',
    name: 'name',
    hint: 'At least three characters',
  },
  Object.assign({}, globalFields.sectors, {
    name: 'sector',
    initialOption: 'All sectors',
  }),
  Object.assign({}, globalFields.countries, {
    initialOption: 'All countries',
  }),
  Object.assign({}, globalFields.ukRegions, {
    name: 'uk_region',
    initialOption: 'All UK regions',
  }),
].map(filter => {
  return Object.assign(filter, {
    modifier: ['smaller', 'light'],
  })
})

const companySortForm = {
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
        { value: 'modified_on:desc', label: 'Recently updated' },
        { value: 'modified_on:asc', label: 'Least recently updated' },
        { value: 'name:asc', label: 'Company name: A-Z' },
        { value: 'name:desc', label: 'Company name: Z-A' },
      ],
    },
  ],
}

const contactSortForm = {
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
        { value: 'modified_on:desc', label: 'Recently updated' },
        { value: 'modified_on:asc', label: 'Least recently updated' },
        { value: 'archived_on:desc', label: 'Recently archived' },
        { value: 'archived_on:asc', label: 'Least recently archived' },
        { value: 'name:asc', label: 'Contact name: A-Z' },
        { value: 'name:desc', label: 'Contact name: Z-A' },
      ],
    },
  ],
}

const contactFiltersFields = [
  {
    macroName: 'MultipleChoiceField',
    name: 'archived',
    type: 'checkbox',
    label: 'Status',
    modifier: ['smaller', 'light'],
    options: [
      { value: 'false', label: 'Active' },
      { value: 'true', label: 'Archived' },
    ],
  },
]

module.exports = {
  companySortForm,
  companyFiltersFields,
  contactSortForm,
  contactFiltersFields,
}
