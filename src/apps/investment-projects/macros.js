const metadata = require('../../lib/metadata')
const { globalFields } = require('../macros')
const { transformObjectToOption } = require('../transformers')
const { collectionFilterLabels, requirementsLabels } = require('./labels')

const investmentFiltersFields = [
  {
    macroName: 'MultipleChoiceField',
    name: 'stage',
    type: 'checkbox',
    options () {
      return metadata.investmentStageOptions.map(transformObjectToOption)
    },
  },
  {
    macroName: 'MultipleChoiceField',
    name: 'investment_type',
    type: 'checkbox',
    options () {
      return metadata.investmentTypeOptions.map(transformObjectToOption)
    },
  },
  Object.assign({}, globalFields.sectors, {
    initialOption: '-- All sectors --',
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
  {
    macroName: 'MultipleChoiceField',
    name: 'status',
    type: 'checkbox',
    options: metadata.investmentStatusOptions,
  },
  {
    macroName: 'MultipleChoiceField',
    name: 'uk_region_location',
    initialOption: '-- Select region --',
    options () {
      return metadata.regionOptions.map(transformObjectToOption)
    },
  },
  {
    macroName: 'MultipleChoiceField',
    name: 'investor_company_country',
    initialOption: '-- Select country --',
    options () {
      return metadata.countryOptions.map(transformObjectToOption)
    },
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
    {
      macroName: 'AddAnother',
      buttonName: 'add_item',
      name: 'strategic_drivers',
      label: requirementsLabels.edit.strategic_drivers,
      children: [
        Object.assign({}, globalFields.strategicDrivers, {
          label: requirementsLabels.edit.strategic_drivers,
          isLabelHidden: true,
        }),
      ],
    },
    {
      macroName: 'TextField',
      type: 'textarea',
      name: 'client_requirements',
      label: requirementsLabels.edit.client_requirements,
    },
    {
      macroName: 'MultipleChoiceField',
      type: 'radio',
      modifier: 'inline',
      name: 'client_considering_other_countries',
      label: requirementsLabels.edit.client_considering_other_countries,
      options: [
        { label: 'Yes', value: 'true' },
        { label: 'No', value: 'false' },
      ],
    },
    {
      macroName: 'AddAnother',
      buttonName: 'add_item',
      name: 'competitor_countries',
      label: requirementsLabels.edit.competitor_countries,
      modifier: 'subfield',
      condition: {
        name: 'client_considering_other_countries',
        value: 'true',
      },
      children: [
        Object.assign({}, globalFields.countries, {
          name: 'competitor_countries',
          label: requirementsLabels.edit.competitor_countries,
          isLabelHidden: true,
        }),
      ],
    },
    {
      macroName: 'AddAnother',
      buttonName: 'add_item',
      name: 'uk_region_locations',
      label: requirementsLabels.edit.uk_region_locations,
      children: [
        Object.assign({}, globalFields.ukRegions, {
          label: requirementsLabels.edit.uk_region_locations,
          isLabelHidden: true,
          name: 'uk_region_locations',
        }),
      ],
    },
    {
      macroName: 'MultipleChoiceField',
      type: 'radio',
      modifier: 'inline',
      name: 'site_decided',
      label: requirementsLabels.edit.site_decided,
      options: [
        { label: 'Yes', value: 'true' },
        { label: 'No', value: 'false' },
      ],
    },
    {
      macroName: 'Fieldset',
      legend: 'Address',
      condition: {
        name: 'site_decided',
        value: 'true',
      },
      children: [
        {
          macroName: 'TextField',
          name: 'address_1',
          label: 'Street',
          modifier: 'compact',
        },
        {
          macroName: 'TextField',
          name: 'address_2',
          label: 'Street 2',
          isLabelHidden: true,
          modifier: 'compact',
        },
        {
          macroName: 'TextField',
          name: 'address_town',
          label: 'Town',
        },
        {
          macroName: 'TextField',
          name: 'address_postcode',
          label: 'Postcode',
          modifier: 'short',
        },
      ],
    },
  ],
}

const statusFormConfig = {
  buttonText: 'Save',
  children: [{
    macroName: 'MultipleChoiceField',
    type: 'radio',
    name: 'status',
    label: 'Status',
    isLabelHidden: true,
    options: metadata.investmentStatusOptions,
  }],
}

module.exports = {
  investmentFiltersFields,
  investmentSortForm,
  requirementsFormConfig,
  statusFormConfig,
}
