const metadataRepo = require('../../../lib/metadata')
const { globalFields } = require('../../macros')
const { transformObjectToOption } = require('../../transformers')
const { assign } = require('lodash')

const eventFormConfig = ({ advisers }) => {
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
      assign({}, globalFields.ukRegions, {
        condition: {
          name: 'address_country',
          value: '80756b9a-5d95-e211-a939-e4115bead28a',
        },
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
      globalFields.serviceDeliveryServices,
      {
        macroName: 'MultipleChoiceField',
        name: 'organiser',
        label: 'Organiser',
        optional: true,
        initialOption: '-- Select organiser --',
        options: advisers,
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

module.exports = eventFormConfig
