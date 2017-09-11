const metadataRepo = require('../../lib/metadata')
const { transformObjectToOption } = require('../transformers')
const { globalFields } = require('../macros')

const eventFormConfig = (organisers) => {
  return {
    method: 'post',
    buttonText: 'Save and Continue',
    children: [
      {
        macroName: 'TextField',
        name: 'event-name',
        label: 'Event name',
      },
      {
        macroName: 'MultipleChoiceField',
        name: 'event-type',
        label: 'Event type',
        initialOption: '-- Select event type --',
        options () {
          metadataRepo.eventTypeOptions.map(transformObjectToOption)
        },
      },
      {
        macroName: 'DateFieldset',
        name: 'event-start-date',
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
        name: 'event-end-date',
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
        name: 'event-location-type',
        label: 'Event location type',
        optional: true,
        initialOption: '-- Select location type --',
        options () {
          metadataRepo.locationTypeOptions.map(transformObjectToOption)
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
        name: 'address_postcode',
        label: 'Postcode',
        class: 'u-js-hidden',
      },
      globalFields.countries,
      {
        macroName: 'TextField',
        type: 'textarea',
        name: 'event-notes',
        label: 'Event notes',
        optional: true,
      },
      {
        macroName: 'MultipleChoiceField',
        name: 'event-team-hosting',
        label: 'Team hosting the event',
        optional: true,
        initialOption: '-- Select team --',
        options () {
          return metadataRepo.teams.map(transformObjectToOption)
        },
      },
      {
        macroName: 'MultipleChoiceField',
        name: 'event-organiser',
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
        buttonName: 'add_event_shared_team',
        name: 'event_shared_teams',
        label: 'Teams',
        isLabelHidden: true,
        children: [
          {
            macroName: 'MultipleChoiceField',
            name: 'event_shared_teams',
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
        macroName: 'MultipleChoiceField',
        name: 'event-related-programmes',
        label: 'Related programmes',
        optional: true,
        initialOption: '-- Select programme --',
        options () {
          return metadataRepo.programmeOptions.map(transformObjectToOption)
        },
      },
    ],
  }
}

module.exports = {
  eventFormConfig,
}
