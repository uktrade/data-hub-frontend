const { flatten } = require('lodash')

const labels = require('../labels')
const FILTER_CONSTANTS = require('../../../lib/filter-constants')
const PRIMARY_SECTOR_NAME = FILTER_CONSTANTS.INTERACTIONS.SECTOR.PRIMARY.NAME

module.exports = function ({
  currentAdviserId,
  permissions,
  sectorOptions,
  serviceOptions,
  teamOptions,
  userAgent,
}) {
  return [
    {
      macroName: 'MultipleChoiceField',
      name: 'kind',
      type: 'checkbox',
      options: [
        { value: 'interaction', label: 'Interaction' },
        { value: 'service_delivery', label: 'Service delivery' },
      ],
      modifier: 'option-select',
    },
    {
      macroName: 'MultipleChoiceField',
      name: 'dit_adviser',
      type: 'checkbox',
      modifier: ['option-select', 'hide-label'],
      options: [
        { value: currentAdviserId, label: 'My interactions' },
      ],
    },
    {
      macroName: 'Typeahead',
      name: 'dit_adviser',
      entity: 'adviser',
      placeholder: 'Search adviser',
    },
    {
      macroName: 'DateField',
      type: 'date',
      name: 'date_after',
      hint: userAgent.isIE ? 'DD/MM/YYYY' : null,
      placeholder: '',
    },
    {
      macroName: 'DateField',
      type: 'date',
      name: 'date_before',
      hint: userAgent.isIE ? 'DD/MM/YYYY' : null,
      placeholder: '',
    },
    {
      macroName: 'Typeahead',
      name: 'dit_team',
      placeholder: 'Search teams',
      options: teamOptions,
    },
    {
      macroName: 'MultipleChoiceField',
      type: 'checkbox',
      name: 'service',
      modifier: 'option-select',
      options: serviceOptions,
    },
    {
      macroName: 'MultipleChoiceField',
      type: 'checkbox',
      name: PRIMARY_SECTOR_NAME,
      modifier: 'option-select',
      options: sectorOptions,
    },
  ].map(filter => {
    return {
      ...filter,
      label: labels.filters[filter.name],
      modifier: flatten([filter.modifier, 'smaller', 'light', 'filter']),
    }
  })
}
