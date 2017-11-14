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

module.exports = {
  companySortForm,
  companyFiltersFields,
}
