const { assign, flatten } = require('lodash')

const labels = require('../labels')
const { communicationChannel, provider } = require('./fields')

const currentYear = (new Date()).getFullYear()

module.exports = function ({ currentAdviserId, channels = [], teams = [] }) {
  return [
    {
      macroName: 'MultipleChoiceField',
      name: 'kind',
      type: 'checkbox',
      options: [
        { value: 'interaction', label: 'Interaction' },
        { value: 'service_delivery', label: 'Service delivery' },
        // { value: 'policy_feedback', label: 'Policy feedback' },
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
    },
    assign({}, communicationChannel(channels), {
      type: 'checkbox',
      modifier: 'option-select',
    }),
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
  ].map(filter => {
    return assign(filter, {
      label: labels.filters[filter.name],
      modifier: flatten([filter.modifier, 'smaller', 'light', 'filter']),
    })
  })
}
