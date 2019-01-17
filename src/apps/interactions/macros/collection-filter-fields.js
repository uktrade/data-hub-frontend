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
  adviserOptions,
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
      classes: 'c-form-group c-form-group--smaller c-form-group--filter',
      placeholder: 'Search adviser',
      options: adviserOptions,
    },
    {
      macroName: 'DateField',
      type: 'date',
      name: 'date_after',
      hint: userAgent.isIE ? 'DD/MM/YYYY' : null,
      placeholder: '',
      inputClass: userAgent.isIE ? 'ie-date-field' : null,
    },
    {
      macroName: 'DateField',
      type: 'date',
      name: 'date_before',
      hint: userAgent.isIE ? 'DD/MM/YYYY' : null,
      placeholder: '',
      inputClass: userAgent.isIE ? 'ie-date-field' : null,
    },
    {
      macroName: 'Typeahead',
      name: 'dit_team',
      placeholder: 'Search teams',
      classes: 'c-form-group c-form-group--smaller c-form-group--filter',
      options: teamOptions,
      isAsync: false,
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
    {
      macroName: 'MultipleChoiceField',
      name: 'was_policy_feedback_provided',
      type: 'checkbox',
      modifier: 'option-select',
      options: [
        { value: 'true', label: 'Includes policy feedback' },
      ],
    },
  ].map(filter => {
    return {
      ...filter,
      label: labels.filters[filter.name],
      modifier: flatten([filter.modifier, 'smaller', 'light', 'filter']),
    }
  })
}
