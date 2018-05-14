const { assign, flatten } = require('lodash')

const labels = require('../labels')
const { provider } = require('./fields')
const FILTER_CONSTANTS = require('../../../lib/filter-constants')
const PRIMARY_SECTOR_NAME = FILTER_CONSTANTS.PROPOSITIONS.SECTOR.PRIMARY.NAME

const currentYear = (new Date()).getFullYear()

module.exports = function ({ currentAdviserId, channels = [], teams = [], sectorOptions }) {
  return [
    {
      macroName: 'MultipleChoiceField',
      name: 'kind',
      type: 'checkbox',
      options: [
        { value: 'proposition', label: 'Proposition' },
        { value: 'service_delivery', label: 'Service delivery' },
        // { value: 'policy_feedback', label: 'Policy feedback' },
      ],
      modifier: 'option-select',
    },
    {
      macroName: 'MultipleChoiceField',
      name: 'adviser',
      type: 'checkbox',
      modifier: ['option-select', 'hide-label'],
      options: [
        { value: currentAdviserId, label: 'My propositions' },
      ],
    },
    {
      macroName: 'Typeahead',
      name: 'adviser',
      entity: 'adviser',
    },
    {
      macroName: 'TextField',
      name: 'date_after',
      hint: 'YYYY-MM-DD',
      placeholder: `e.g. ${currentYear}-07-18`,
    },
    {
      macroName: 'TextField',
      name: 'date_before',
      hint: 'YYYY-MM-DD',
      placeholder: `e.g. ${currentYear}-07-21`,
    },
    assign({}, provider(teams), {
      type: 'checkbox',
      modifier: 'option-select',
    }),
    {
      macroName: 'MultipleChoiceField',
      type: 'checkbox',
      name: PRIMARY_SECTOR_NAME,
      modifier: 'option-select',
      options: sectorOptions,
    },
  ].map(filter => {
    return assign(filter, {
      label: labels.filters[filter.name],
      modifier: flatten([filter.modifier, 'smaller', 'light', 'filter']),
    })
  })
}
