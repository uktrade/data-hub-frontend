const { assign, flatten } = require('lodash')

const { globalFields } = require('../macros')
const { accountManagementDisplayLabels } = require('./labels')
const { transformObjectToOption } = require('../transformers')
const FILTER_CONSTANTS = require('../../lib/filter-constants')
const PRIMARY_SECTOR_NAME = FILTER_CONSTANTS.COMPANIES.SECTOR.PRIMARY.NAME

const companyFiltersFields = function ({ sectorOptions }) {
  return [
    Object.assign({}, globalFields.headquarter_type, {
      name: 'headquarter_type',
      type: 'checkbox',
      modifier: 'option-select',
    }),
    {
      macroName: 'TextField',
      label: 'Company name',
      name: 'name',
      hint: 'At least three characters',
    },
    {
      macroName: 'MultipleChoiceField',
      name: PRIMARY_SECTOR_NAME,
      type: 'checkbox',
      modifier: 'option-select',
      options: sectorOptions,
      label: 'Sector',
    },
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
