const { assign } = require('lodash')

const metadataRepo = require('../../lib/metadata')
const { transformObjectToOption } = require('../transformers')
const { globalFields } = require('../macros')
const { collectionFilterLabels } = require('./labels')

const currentYear = (new Date()).getFullYear()

const eventFormConfig = (organisers) => {
  return {
    method: 'post',
    buttonText: 'Save and Continue',
    children: [
      {
        macroName: 'TextField',
        name: 'name',
        label: 'Event name',
      },
      {
        macroName: 'MultipleChoiceField',
        name: 'event_type',
        label: 'Event type',
        initialOption: '-- Select event type --',
        options () {
          return metadataRepo.eventTypeOptions.map(transformObjectToOption)
        },
      },
      {
        macroName: 'DateFieldset',
        name: 'start_date',
        label: 'Event start date',
        optional: true,
        value: {
          year: '',
          month: '',
          day: '',
        },
      },
      {
        macroName: 'DateFieldset',
        name: 'end_date',
        label: 'Event end date',
        optional: true,
        value: {
          year: '',
          month: '',
          day: '',
        },
      },
      {
        macroName: 'MultipleChoiceField',
        name: 'location_type',
        label: 'Event location type',
        optional: true,
        initialOption: '-- Select location type --',
        options () {
          return metadataRepo.locationTypeOptions.map(transformObjectToOption)
        },
      },
      {
        macroName: 'TextField',
        name: 'address_1',
        label: 'Business and street',
      },
      {
        macroName: 'TextField',
        name: 'address_2',
        label: 'Second line of address',
        isLabelHidden: true,
        optional: true,
      },
      {
        macroName: 'TextField',
        name: 'address_town',
        label: 'Town or city',
      },
      {
        macroName: 'TextField',
        name: 'address_county',
        label: 'County',
      },
      {
        macroName: 'TextField',
        name: 'postcode',
        label: 'Postcode',
        class: 'u-js-hidden',
      },
      assign({}, globalFields.countries, {
        name: 'address_country',
      }),
      {
        macroName: 'TextField',
        type: 'textarea',
        name: 'notes',
        label: 'Event notes',
        optional: true,
      },
      {
        macroName: 'MultipleChoiceField',
        name: 'lead_team',
        label: 'Team hosting the event',
        optional: true,
        initialOption: '-- Select team --',
        options () {
          return metadataRepo.teams.map(transformObjectToOption)
        },
      },
      {
        macroName: 'MultipleChoiceField',
        name: 'organiser',
        label: 'Organiser',
        optional: true,
        initialOption: '-- Select organiser --',
        options: organisers,
      },
      {
        macroName: 'MultipleChoiceField',
        type: 'radio',
        name: 'event_shared',
        label: 'Is this a shared event',
        optional: true,
        modifier: 'inline',
        options: [
          {
            label: 'Yes',
            value: 'Yes',
          },
          {
            label: 'No',
            value: 'No',
          },
        ],
      },
      {
        macroName: 'AddAnother',
        buttonName: 'add_team',
        name: 'teams',
        label: 'Teams',
        isLabelHidden: true,
        children: [
          {
            macroName: 'MultipleChoiceField',
            name: 'teams',
            label: 'Teams',
            isLabelHidden: true,
            optional: true,
            initialOption: '-- Select team --',
            options () {
              return metadataRepo.teams.map(transformObjectToOption)
            },
          },
        ],
        condition: {
          name: 'event_shared',
          value: 'Yes',
        },
      },
      {
        macroName: 'AddAnother',
        buttonName: 'add_related_programme',
        name: 'related_programmes',
        label: 'Related programmes',
        children: [
          {
            macroName: 'MultipleChoiceField',
            name: 'related_programmes',
            label: 'Related programmes',
            isLabelHidden: true,
            optional: true,
            initialOption: '-- Select programme --',
            options () {
              return metadataRepo.programmeOptions.map(transformObjectToOption)
            },
          },
        ],
      },
    ],
  }
}

const eventFiltersFields = [
  {
    macroName: 'TextField',
    name: 'name',
    hint: 'At least three characters',
  },
  assign({}, globalFields.eventTypes, {
    name: 'event_type',
    initialOption: 'All types',
  }),
  assign({}, globalFields.countries, {
    name: 'address_country',
    initialOption: 'All countries',
  }),
  assign({}, globalFields.ukRegions, {
    name: 'uk_region',
    initialOption: 'All UK regions',
  }),
  {
    macroName: 'TextField',
    name: 'start_date',
    hint: 'YYYY-MM-DD',
    placeholder: `e.g. ${currentYear}-07-18`,
  },
  {
    macroName: 'TextField',
    name: 'end_date',
    hint: 'YYYY-MM-DD',
    placeholder: `e.g. ${currentYear}-07-21`,
  },
].map(filter => {
  return assign(filter, {
    label: collectionFilterLabels.edit[filter.name],
    modifier: ['smaller', 'light'],
  })
})

const eventSortForm = {
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
        { value: 'name:asc', label: 'Event name: A-Z' },
        { value: 'name:desc', label: 'Event name: Z-A' },
        { value: 'modified_on:desc', label: 'Recently updated' },
        { value: 'modified_on:asc', label: 'Least recently updated' },
        { value: 'start_date:asc', label: 'Earliest start date' },
        { value: 'start_date:desc', label: 'Latest start date' },
        { value: 'end_date:asc', label: 'Earliest end date' },
        { value: 'end_date:desc', label: 'Latest end date' },
      ],
    },
  ],
}

module.exports = {
  eventFormConfig,
  eventFiltersFields,
  eventSortForm,
}
