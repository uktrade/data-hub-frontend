/* eslint camelcase: 0 */
const { assign, flatten, get } = require('lodash')

const { globalFields } = require('../macros')
const formLabels = require('./labels')
const { transformObjectToOption } = require('../transformers')

const companyFiltersFields = function ({
  sector,
  registered_address_country,
  uk_region,
} = {}) {
  return [
    {
      macroName: 'TextField',
      label: 'Company name',
      name: 'name',
      hint: 'At least three characters',
    },
    assign({}, globalFields.sectors, {
      name: 'sector',
      type: 'checkbox',
      modifier: 'option-select',
      options: sector,
    }),
    assign({}, globalFields.countries, {
      type: 'checkbox',
      modifier: 'option-select',
      options: registered_address_country,
    }),
    assign({}, globalFields.ukRegions, {
      name: 'uk_region',
      type: 'checkbox',
      modifier: 'option-select',
      options: uk_region,
    })]
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
