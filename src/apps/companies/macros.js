const { assign, flatten, merge } = require('lodash')

const { globalFields } = require('../macros')
const formLabels = require('./labels')
const { transformObjectToOption } = require('../transformers')

const companySortFormBase = {
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

const companySortForm = merge({}, companySortFormBase, {
  children: [
    {
      options: [
        { value: 'modified_on:desc', label: 'Recently updated' },
        { value: 'modified_on:asc', label: 'Least recently updated' },
        { value: 'name:asc', label: 'Company name: A-Z' },
        { value: 'name:desc', label: 'Company name: Z-A' },
      ],
    },
  ],
})

const companySubsidiarySortForm = merge({}, companySortFormBase, {
  children: [
    {
      options: [
        { value: 'modified_on:desc', label: 'Recently updated' },
        { value: 'modified_on:asc', label: 'Least recently updated' },
        { value: 'name:asc', label: 'Subsidiary name: A-Z' },
        { value: 'name:desc', label: 'Subsidiary name: Z-A' },
      ],
    },
  ],
})

const companyFiltersFields = [
  {
    macroName: 'TextField',
    label: 'Company name',
    name: 'name',
    hint: 'At least three characters',
  },
  {
    macroName: 'MultipleChoiceField',
    name: 'company_type',
    type: 'checkbox',
    label: 'Type',
    options: [
      { value: 'ghq', label: 'Global HQ' },
    ],
    modifier: 'option-select',
  },
  assign({}, globalFields.sectors, {
    name: 'sector',
    type: 'checkbox',
    modifier: 'option-select',
  }),
  assign({}, globalFields.countries, {
    type: 'checkbox',
    modifier: 'option-select',
  }),
  assign({}, globalFields.ukRegions, {
    name: 'uk_region',
    type: 'checkbox',
    modifier: 'option-select',
  }),
].map((filter) => {
  return assign(filter, {
    modifier: flatten([filter.modifier, 'smaller', 'light', 'filter']),
  })
})

const companySubsidiaryFiltersFields = [
  // {
  //   macroName: 'TextField',
  //   label: 'Subsidiary name',
  //   name: 'name',
  //   hint: 'At least three characters',
  //   modifier: ['smaller', 'light', 'filter'],
  // },
]

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
  companySubsidiarySortForm,
  companySubsidiaryFiltersFields,
  accountManagementFormConfig,
}
