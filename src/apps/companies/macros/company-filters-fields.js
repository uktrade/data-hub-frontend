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

module.exports = companyFiltersFields
