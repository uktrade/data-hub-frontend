const { assign, flatten, get } = require('lodash')

const metadata = require('../../lib/metadata')
const { globalFields } = require('../macros')
const { transformObjectToOption } = require('../transformers')
const { collectionFilterLabels, requirementsLabels } = require('./labels')
const FILTER_CONSTANTS = require('../../lib/filter-constants')

const PRIMARY_SECTOR_NAME =
  FILTER_CONSTANTS.INVESTMENT_PROJECTS.SECTOR.PRIMARY.NAME

const investmentFiltersFields = function ({
  currentAdviserId,
  sectorOptions,
  adviserOptions,
  userAgent,
}) {
  return [
    {
      macroName: 'MultipleChoiceField',
      name: 'stage',
      type: 'checkbox',
      modifier: 'option-select',
      options() {
        return metadata.investmentStageOptions.map(transformObjectToOption)
      },
    },
    {
      macroName: 'MultipleChoiceField',
      name: 'adviser',
      type: 'checkbox',
      modifier: ['option-select', 'hide-label'],
      options: [{ value: currentAdviserId, label: 'My Projects' }],
    },
    {
      macroName: 'Typeahead',
      name: 'adviser',
      entity: 'adviser',
      placeholder: 'Search adviser',
      options: adviserOptions,
      hideInactive: false,
      target: 'metadata',
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
      macroName: 'Typeahead',
      name: 'investor_company_country',
      isAsync: false,
      placeholder: 'Search country',
      useSubLabel: false,
      options: get(metadata, 'countryOptions', []).map(transformObjectToOption),
      hideInactive: false,
      target: 'metadata',
      label: 'Country of origin',
    },
    {
      macroName: 'Typeahead',
      name: 'uk_region_location',
      isAsync: false,
      placeholder: 'Search UK region',
      useSubLabel: false,
      options: get(metadata, 'regionOptions', []).map(transformObjectToOption),
      hideInactive: false,
      target: 'metadata',
      label: 'UK region',
    },
    {
      macroName: 'MultipleChoiceField',
      name: 'status',
      type: 'checkbox',
      modifier: 'option-select',
      options: metadata.investmentStatusOptions,
    },
    {
      macroName: 'MultipleChoiceField',
      name: 'investment_type',
      type: 'checkbox',
      modifier: 'option-select',
      options() {
        return metadata.investmentTypeOptions.map(transformObjectToOption)
      },
    },
    {
      macroName: 'MultipleChoiceField',
      name: 'likelihood_to_land',
      type: 'checkbox',
      modifier: 'option-select',
      options() {
        return metadata.likelihoodToLandOptions.map(transformObjectToOption)
      },
    },
    {
      macroName: 'DateField',
      type: 'date',
      name: 'estimated_land_date_before',
      hint: userAgent.isIE ? 'DD/MM/YYYY' : null,
      inputClass: userAgent.isIE ? 'ie-date-field' : null,
    },
    {
      macroName: 'DateField',
      type: 'date',
      name: 'estimated_land_date_after',
      hint: userAgent.isIE ? 'DD/MM/YYYY' : null,
      inputClass: userAgent.isIE ? 'ie-date-field' : null,
    },
    {
      macroName: 'DateField',
      type: 'date',
      name: 'actual_land_date_before',
      hint: userAgent.isIE ? 'DD/MM/YYYY' : null,
      inputClass: userAgent.isIE ? 'ie-date-field' : null,
    },
    {
      macroName: 'DateField',
      type: 'date',
      name: 'actual_land_date_after',
      hint: userAgent.isIE ? 'DD/MM/YYYY' : null,
      inputClass: userAgent.isIE ? 'ie-date-field' : null,
    },
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
      inputClass: 'js-MirrorValue',
      inputData: {
        'target-selector': '.c-collection-filters input[name="sortby"]',
      },
      options: [
        { value: 'created_on:desc', label: 'Most recently created' },
        { value: 'estimated_land_date:asc', label: 'Earliest land date' },
        { value: 'estimated_land_date:desc', label: 'Latest land date' },
        { value: 'name:asc', label: 'Project name' },
        { value: 'stage.name', label: 'Stage' },
      ],
    },
  ],
}

const requirementsFormConfig = ({
  strategicDrivers,
  countries,
  ukRegions,
  partners,
}) => {
  const labels = requirementsLabels.edit

  return {
    buttonText: 'Save',
    children: [
      {
        macroName: 'AddAnother',
        buttonName: 'add_item',
        name: 'strategic_drivers',
        label: requirementsLabels.edit.strategic_drivers,
        children: [
          assign({}, globalFields.strategicDrivers, {
            label: labels.strategic_drivers,
            isLabelHidden: true,
            options: strategicDrivers,
          }),
        ],
      },
      {
        macroName: 'TextField',
        type: 'textarea',
        name: 'client_requirements',
        label: labels.client_requirements,
      },
      {
        macroName: 'MultipleChoiceField',
        type: 'radio',
        modifier: 'inline',
        name: 'client_considering_other_countries',
        label: labels.client_considering_other_countries,
        options: [
          { label: 'Yes', value: 'true' },
          { label: 'No', value: 'false' },
        ],
      },
      {
        macroName: 'AddAnother',
        buttonName: 'add_item',
        name: 'competitor_countries',
        label: labels.competitor_countries,
        modifier: 'subfield',
        condition: {
          name: 'client_considering_other_countries',
          value: 'true',
        },
        children: [
          assign({}, globalFields.countries, {
            name: 'competitor_countries',
            label: labels.competitor_countries,
            isLabelHidden: true,
            options: countries,
          }),
        ],
      },
      {
        macroName: 'AddAnother',
        buttonName: 'add_item',
        name: 'uk_region_locations',
        label: requirementsLabels.edit.uk_region_locations,
        children: [
          assign({}, globalFields.ukRegions, {
            label: labels.uk_region_locations,
            isLabelHidden: true,
            name: 'uk_region_locations',
            options: ukRegions,
          }),
        ],
      },
      {
        macroName: 'MultipleChoiceField',
        type: 'radio',
        modifier: 'inline',
        name: 'site_decided',
        label: labels.site_decided,
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
            label: requirementsLabels.edit.address_1,
            modifier: 'compact',
          },
          {
            macroName: 'TextField',
            name: 'address_2',
            label: requirementsLabels.edit.address_2,
            isLabelHidden: true,
            modifier: 'compact',
          },
          {
            macroName: 'TextField',
            name: 'address_town',
            label: requirementsLabels.edit.address_town,
          },
          {
            macroName: 'TextField',
            name: 'address_postcode',
            label: requirementsLabels.edit.address_postcode,
            modifier: 'short',
          },
        ],
      },
      {
        macroName: 'AddAnother',
        buttonName: 'add_item',
        name: 'actual_uk_regions',
        label: requirementsLabels.edit.actual_uk_regions,
        condition: {
          name: 'site_decided',
          value: 'true',
        },
        children: [
          assign({}, globalFields.ukRegions, {
            label: labels.actual_uk_regions,
            isLabelHidden: true,
            name: 'actual_uk_regions',
            options: ukRegions,
          }),
        ],
      },
      {
        macroName: 'AddAnother',
        buttonName: 'add_item',
        name: 'delivery_partners',
        children: [
          {
            macroName: 'MultipleChoiceField',
            name: 'delivery_partners',
            label: labels.delivery_partners,
            isLabelHidden: true,
            options: partners,
            initialOption: '-- Select a partner --',
          },
        ],
      },
    ].map((field) => {
      return assign(field, {
        label: requirementsLabels.edit[field.name],
      })
    }),
  }
}

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
  investmentFiltersFields,
  investmentSortForm,
  requirementsFormConfig,
  statusFormConfig,
  investmentProfilesFiltersFields,
}
