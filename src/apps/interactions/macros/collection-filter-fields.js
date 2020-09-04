const { flatten } = require('lodash')

const labels = require('../labels')
const FILTER_CONSTANTS = require('../../../lib/filter-constants')

const PRIMARY_SECTOR_NAME = FILTER_CONSTANTS.INTERACTIONS.SECTOR.PRIMARY.NAME

module.exports = function ({
  currentAdviserId,
  sectorOptions,
  serviceOptions,
  teamOptions,
  adviserOptions,
  oneListTierOptions,
  userAgent,
  areas,
  types,
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
      name: 'dit_participants__adviser',
      type: 'checkbox',
      modifier: ['option-select', 'hide-label'],
      options: [{ value: currentAdviserId, label: 'My interactions' }],
    },
    {
      macroName: 'Typeahead',
      name: 'dit_participants__adviser',
      entity: 'adviser',
      placeholder: 'Search adviser',
      useSubLabel: false,
      options: adviserOptions,
      hideInactive: false,
      target: 'metadata',
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
      name: 'dit_participants__team',
      placeholder: 'Search teams',
      options: teamOptions,
      isAsync: false,
      useSubLabel: false,
      target: 'metadata',
    },
    {
      macroName: 'MultipleChoiceField',
      type: 'checkbox',
      name: 'service',
      modifier: 'option-select',
      options: serviceOptions,
    },
    {
      macroName: 'Typeahead',
      name: PRIMARY_SECTOR_NAME,
      isAsync: false,
      placeholder: 'Search sector',
      useSubLabel: false,
      options: sectorOptions,
      hideInactive: false,
      target: 'metadata',
      label: 'Sector',
    },
    {
      macroName: 'MultipleChoiceField',
      name: 'was_policy_feedback_provided',
      type: 'checkbox',
      modifier: 'option-select',
      options: [{ value: 'true', label: 'Includes policy feedback' }],
    },
    {
      macroName: 'MultipleChoiceField',
      type: 'checkbox',
      name: 'policy_areas',
      modifier: 'option-select',
      options: areas,
    },
    {
      macroName: 'MultipleChoiceField',
      type: 'checkbox',
      name: 'policy_issue_types',
      modifier: 'option-select',
      options: types,
    },
    {
      macroName: 'MultipleChoiceField',
      type: 'checkbox',
      name: 'company_one_list_group_tier',
      modifier: 'option-select',
      options: oneListTierOptions,
    },
  ].map((filter) => {
    return {
      ...filter,
      label: labels.filters[filter.name],
      modifier: flatten([filter.modifier, 'smaller', 'light', 'filter']),
    }
  })
}
