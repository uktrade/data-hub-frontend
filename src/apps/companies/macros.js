const { assign } = require('lodash')

const { globalFields } = require('../macros')
const formLabels = require('./labels')
const { transformObjectToOption } = require('../transformers')

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

const accountManagementFormConfig = function ({
  returnLink,
  advisers = [],
}) {
  return {
    returnLink,
    buttonText: 'Save',
    returnText: 'Cancel',
    children: [
      {
        macroName: 'MultipleChoiceField',
        name: 'one_list_account_owner',
        initialOption: '-- Select account manager --',
        optional: true,
        options () {
          return advisers.map(transformObjectToOption)
        },
      },
    ].map(field => {
      return assign(field, {
        label: formLabels.accountManagementDisplayLabels[field.name],
      })
    }),
  }
}

module.exports = {
  companySortForm,
  companyFiltersFields,
  accountManagementFormConfig,
}
