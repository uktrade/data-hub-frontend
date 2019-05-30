const { flatten } = require('lodash')

const { globalFields } = require('../../macros')
const FILTER_CONSTANTS = require('../../../lib/filter-constants')
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
    },
    {
      macroName: 'Typeahead',
      name: PRIMARY_SECTOR_NAME,
      isAsync: false,
      classes: 'c-form-group c-form-group--smaller c-form-group--filter',
      placeholder: 'Search sector',
      useSubLabel: false,
      options: sectorOptions,
      hideInactive: false,
      target: 'metadata',
      label: 'Sector',
    },
    {
      macroName: 'Typeahead',
      name: 'country',
      isAsync: false,
      classes: 'c-form-group c-form-group--smaller c-form-group--filter',
      placeholder: 'Search country',
      useSubLabel: false,
      options: globalFields.countries.options(),
      hideInactive: false,
      target: 'metadata',
      label: 'Country',
    },
    Object.assign({}, globalFields.ukRegions, {
      name: 'uk_region',
      type: 'checkbox',
      modifier: 'option-select',
    }),
    {
      macroName: 'MultipleChoiceField',
      name: 'archived',
      type: 'checkbox',
      label: 'Status',
      options: [
        { value: 'false', label: 'Active' },
        { value: 'true', label: 'Inactive' },
      ],
      modifier: 'option-select',
    },
  ].map(filter => {
    return Object.assign(filter, {
      modifier: flatten([filter.modifier, 'smaller', 'light', 'filter']),
    })
  })
}

module.exports = companyFiltersFields
