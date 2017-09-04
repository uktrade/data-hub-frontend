const metadataRepo = require('../../lib/metadata')
const { transformObjectToOption } = require('../transformers')
const { globalFields } = require('../macros')

const eventForm = {
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
      options: [ // todo: meta data endpoint
        { label: 'event type 1' },
        { label: 'event type 2' },
        { label: 'event type 3' },
        { label: 'event type 4' },
        { label: 'event type 5' },
      ],
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
      options: [ // todo: meta data endpoint
        { label: 'location type 1' },
        { label: 'location type 2' },
        { label: 'location type 3' },
        { label: 'location type 4' },
      ],
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
      label: 'Team hosting the event', // todo: pre select current user team
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
      options () {
        return [ '1', '2' ]
      },
    },
    {
      macroName: 'MultipleChoiceField',
      type: 'radio',
      name: 'event-shared',
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
      macroName: 'MultipleChoiceField',
      name: 'event-teams',
      label: 'Teams',
      initialOption: '-- Select team --',
      isLabelHidden: true,
      options () {
        return metadataRepo.teams.map(transformObjectToOption)
      },
      condition: {
        name: 'event-shared',
        value: 'Yes',
      },
    },
    {
      macroName: 'MultipleChoiceField',
      name: 'event-related-programmes',
      label: 'Related programmes',
      optional: true,
      initialOption: '-- Select programme --',
      options: [ // todo: meta data endpoint
        { label: 'programme 1' },
        { label: 'programme 2' },
        { label: 'programme 3' },
      ],
    },
  ],
}

module.exports = {
  eventForm,
}
