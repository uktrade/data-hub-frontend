const metadataRepo = require('../../lib/metadata')
const { transformObjectToOption } = require('../transformers')
const { collectionFilterLabels } = require('./labels')

const investmentFiltersFields = [
  {
    macroName: 'MultipleChoiceField',
    name: 'stage',
    type: 'checkbox',
    options () {
      return metadataRepo.investmentStageOptions.map(transformObjectToOption)
    },
  },
  {
    macroName: 'MultipleChoiceField',
    name: 'investment_type',
    type: 'checkbox',
    options () {
      return metadataRepo.investmentTypeOptions.map(transformObjectToOption)
    },
  },
  {
    macroName: 'MultipleChoiceField',
    name: 'sector',
    initialOption: 'All sectors',
    options () {
      return metadataRepo.sectorOptions.map(transformObjectToOption)
    },
  },
  {
    macroName: 'TextField',
    name: 'estimated_land_date_before',
    hint: 'YYYY-MM-DD',
    placeholder: 'e.g. 2018-07-18',
  },
  {
    macroName: 'TextField',
    name: 'estimated_land_date_after',
    hint: 'YYYY-MM-DD',
    placeholder: 'e.g. 2019-05-09',
  },
].map(filter => {
  filter.label = collectionFilterLabels.edit[filter.name]
  return filter
})

const investmentSortForm = {
  method: 'get',
  class: 'c-collection__sort-form js-AutoSubmit',
  hideFormActions: true,
  hiddenFields: { custom: true },
  children: [
    {
      macroName: 'MultipleChoiceField',
      label: 'Sort by',
      name: 'sortby',
      modifier: ['small', 'inline', 'light'],
      options: [
        { value: 'estimated_land_date:asc', label: 'Earliest land date' },
        { value: 'estimated_land_date:desc', label: 'Latest land date' },
        { value: 'project_code', label: 'Project code' },
        { value: 'name:asc', label: 'Project name' },
        { value: 'stage.name', label: 'Stage' },
      ],
    },
  ],
}

module.exports = {
  investmentFiltersFields,
  investmentSortForm,
}
