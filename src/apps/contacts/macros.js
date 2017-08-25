const { globalFields } = require('../macros')

const contactFiltersFields = [
  {
    macroName: 'TextField',
    label: 'Company name',
    name: 'company_name',
    hint: 'At least three characters',
  },
  Object.assign({}, globalFields.sectors, {
    name: 'company_sector',
    initialOption: 'All sectors',
  }),
  Object.assign({}, globalFields.countries, {
    name: 'address_country',
    initialOption: 'All countries',
  }),
  Object.assign({}, globalFields.ukRegions, {
    name: 'company_uk_region',
    initialOption: 'All UK regions',
  }),
].map(filter => {
  return Object.assign(filter, {
    modifier: ['smaller', 'light'],
  })
})

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
      ],
    },
  ],
}

module.exports = {
  contactFiltersFields,
  contactSortForm,
}
