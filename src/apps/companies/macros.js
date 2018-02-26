const { assign, flatten } = require('lodash')

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
    type: 'checkbox',
    modifier: 'option-select',
  }),
  Object.assign({}, globalFields.countries, {
    type: 'checkbox',
    modifier: 'option-select',
  }),
  Object.assign({}, globalFields.ukRegions, {
    name: 'uk_region',
    type: 'checkbox',
    modifier: 'option-select',
  }),
].map(filter => {
  return Object.assign(filter, {
    modifier: flatten([filter.modifier, 'smaller', 'light', 'filter']),
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
    buttonText: 'Save and return',
    returnText: 'Return without saving',
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
