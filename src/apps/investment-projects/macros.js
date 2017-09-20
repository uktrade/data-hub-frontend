const metadataRepo = require('../../lib/metadata')
const { globalFields } = require('../macros')
const { transformObjectToOption } = require('../transformers')
const { collectionFilterLabels, requirementsLabels } = require('./labels')

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
  Object.assign({}, globalFields.sectors, {
    initialOption: 'All sectors',
  }),
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
  return Object.assign(filter, {
    label: collectionFilterLabels.edit[filter.name],
    modifier: ['smaller', 'light'],
  })
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

const requirementsFormConfig = {
  buttonText: 'Save',
  children: [
    Object.assign({}, globalFields.strategicDrivers, {
      initialOption: 'Choose a strategic driver',
      label: requirementsLabels.edit.strategic_drivers,
    }),
    {
      macroName: 'TextField',
      type: 'textarea',
      name: 'client_requirements',
      optional: true,
      label: requirementsLabels.edit.client_requirements,
    },
    {
      macroName: 'MultipleChoiceField',
      type: 'radio',
      modifier: 'inline',
      optional: true,
      name: 'client_considering_other_countries',
      label: requirementsLabels.edit.client_considering_other_countries,
      options: [
        { label: 'Yes', value: 'true' },
        { label: 'No', value: 'false' },
      ],
    },
    Object.assign({}, globalFields.countries, {
      name: 'competitor_countries',
      initialOption: 'Select country',
      label: requirementsLabels.edit.competitor_countries,
      modifier: 'subfield',
      condition: {
        name: 'client_considering_other_countries',
        value: 'true',
      },
    }),
    Object.assign({}, globalFields.ukRegions, {
      name: 'uk_region_locations',
      label: requirementsLabels.edit.uk_region_locations,
      initialOption: 'Select UK region',
    }),
    {
      macroName: 'MultipleChoiceField',
      type: 'radio',
      modifier: 'inline',
      name: 'site_decided',
      optional: true,
      label: requirementsLabels.edit.site_decided,
      options: [
        { label: 'Yes', value: 'true' },
        { label: 'No', value: 'false' },
      ],
    },
  ],
}

module.exports = {
  investmentFiltersFields,
  investmentSortForm,
  requirementsFormConfig,
}
