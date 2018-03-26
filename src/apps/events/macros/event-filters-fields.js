const { assign, flatten } = require('lodash')
const { globalFields } = require('../../macros')
const { collectionFilterLabels } = require('../labels')
const currentYear = (new Date()).getFullYear()
const { transformObjectToOption } = require('../../transformers')

const eventFiltersFields = ({ advisers }) => {
  return [
    {
      macroName: 'TextField',
      name: 'name',
      hint: 'At least three characters',
    },
    {
      macroName: 'Typeahead',
      name: 'organiser',
      entity: 'adviser',
      options: advisers.map(transformObjectToOption),
    },
    assign({}, globalFields.eventTypes, {
      name: 'event_type',
      type: 'checkbox',
      modifier: 'option-select',
    }),
    assign({}, globalFields.countries, {
      name: 'address_country',
      type: 'checkbox',
      modifier: 'option-select',
    }),
    assign({}, globalFields.ukRegions, {
      name: 'uk_region',
      type: 'checkbox',
      modifier: 'option-select',
    }),
    {
      macroName: 'TextField',
      name: 'start_date_after',
      hint: 'YYYY-MM-DD',
      placeholder: `e.g. ${currentYear}-07-18`,
    },
    {
      macroName: 'TextField',
      name: 'start_date_before',
      hint: 'YYYY-MM-DD',
      placeholder: `e.g. ${currentYear}-07-21`,
    },
  ].map(filter => {
    return assign(filter, {
      label: collectionFilterLabels.edit[filter.name],
      modifier: flatten([filter.modifier, 'smaller', 'light', 'filter']),
    })
  })
}

module.exports = eventFiltersFields
