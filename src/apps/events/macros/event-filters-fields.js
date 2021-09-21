const { assign, flatten } = require('lodash')
const { globalFields } = require('../../macros')
const { collectionFilterLabels } = require('../labels')
const { transformObjectToOption } = require('../../transformers')

const eventFiltersFields = ({ advisers, userAgent }) => {
  return [
    {
      macroName: 'TextField',
      name: 'name',
    },
    {
      macroName: 'Typeahead',
      name: 'organiser',
      entity: 'adviser',
      placeholder: 'Search organiser',
      options: advisers.map(transformObjectToOption),
      hideInactive: false,
      target: 'metadata',
    },
    {
      macroName: 'DateField',
      type: 'date',
      name: 'start_date_after',
      hint: userAgent.isIE ? 'DD/MM/YYYY' : null,
    },
    {
      macroName: 'DateField',
      type: 'date',
      name: 'start_date_before',
      hint: userAgent.isIE ? 'DD/MM/YYYY' : null,
    },
    {
      macroName: 'Typeahead',
      name: 'address_country',
      isAsync: false,
      placeholder: 'Search country',
      useSubLabel: false,
      options: globalFields.countries.options(),
      hideInactive: false,
      target: 'metadata',
      label: 'Country',
    },
    {
      macroName: 'Typeahead',
      name: 'uk_region',
      isAsync: false,
      placeholder: 'Search UK region',
      useSubLabel: false,
      options: globalFields.ukRegions.options(),
      hideInactive: false,
      target: 'metadata',
      label: 'UK region',
    },
    assign({}, globalFields.eventTypes, {
      name: 'event_type',
      type: 'checkbox',
      modifier: 'option-select',
    }),
  ].map((filter) => {
    return assign(filter, {
      label: collectionFilterLabels.edit[filter.name],
      modifier: flatten([filter.modifier, 'smaller', 'light', 'filter']),
    })
  })
}

module.exports = eventFiltersFields
