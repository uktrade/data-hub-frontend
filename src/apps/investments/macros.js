const { flatten } = require('lodash')

const metadata = require('../../lib/metadata')
const { collectionFilterLabels } = require('./labels')

const statusFormConfig = {
  buttonText: 'Save',
  children: [
    {
      macroName: 'MultipleChoiceField',
      type: 'radio',
      name: 'status',
      label: 'Status',
      isLabelHidden: true,
      options: metadata.investmentStatusOptions,
    },
  ],
}

const investmentProfilesFiltersFields = function () {
  return [
    {
      macroName: 'MultipleChoiceField',
      name: 'level_of_involvement_simplified',
      type: 'checkbox',
      modifier: 'option-select',
      options: [
        { value: 'involved', label: 'Involved' },
        { value: 'not_involved', label: 'Not involved' },
        { value: 'unspecified', label: 'Unspecified' },
      ],
    },
  ].map((filter) => {
    return Object.assign(filter, {
      label: collectionFilterLabels.edit[filter.name],
      modifier: flatten([filter.modifier, 'smaller', 'light', 'filter']),
    })
  })
}

module.exports = {
  statusFormConfig,
  investmentProfilesFiltersFields,
}
