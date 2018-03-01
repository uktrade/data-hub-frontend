const { assign, flatten } = require('lodash')

const { globalFields } = require('../macros')
const { accountManagementDisplayLabels, hqLabels } = require('./labels')
const { transformObjectToOption } = require('../transformers')

const companyFiltersFields = [
  {
    macroName: 'TextField',
    label: 'Company name',
    name: 'name',
    hint: 'At least three characters',
  },
  {
    macroName: 'MultipleChoiceField',
    name: 'headquarter_type',
    type: 'checkbox',
    label: 'Type',
    options: [
      { value: '43281c5e-92a4-4794-867b-b4d5f801e6f3', label: hqLabels.ghq },
      { value: 'eb59eaeb-eeb8-4f54-9506-a5e08773046b', label: hqLabels.ehq },
      { value: '3e6debb4-1596-40c5-aa25-f00da0e05af9', label: hqLabels.ukhq },
    ],
    modifier: 'option-select',
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
      inputClass: 'js-MirrorValue',
      inputData: {
        'target-selector': '.c-collection-filters input[name="sortby"]',
      },
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
        label: accountManagementDisplayLabels[field.name],
      })
    }),
  }
}

module.exports = {
  companySortForm,
  companyFiltersFields,
  accountManagementFormConfig,
}
