const { assign } = require('lodash')

const { globalFields } = require('../../macros')
const { transformObjectToOption } = require('../../transformers')

const eventFormConfig = ({ advisers }) => {
  return {
    method: 'post',
    buttonText: 'Save',
    children: [
      {
        macroName: 'TextField',
        name: 'name',
        label: 'Event name',
      },
      globalFields.eventTypes,
      {
        macroName: 'DateFieldset',
        name: 'start_date',
        label: 'Event start date',
        optional: true,
      },
      {
        macroName: 'DateFieldset',
        name: 'end_date',
        label: 'Event end date',
        optional: true,
      },
      assign({}, globalFields.locationTypes, {
        label: 'Event location type',
        optional: true,
      }),
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
      assign({}, globalFields.teams, {
        name: 'lead_team',
        label: 'Team hosting the event',
        optional: true,
      }),
      globalFields.serviceDeliveryServices,
      {
        macroName: 'MultipleChoiceField',
        name: 'organiser',
        label: 'Organiser',
        optional: true,
        initialOption: '-- Select organiser --',
        options: advisers.map(transformObjectToOption),
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
            value: 'true',
          },
          {
            label: 'No',
            value: 'false',
          },
        ],
      },
      {
        macroName: 'AddAnother',
        buttonName: 'add_team',
        name: 'teams',
        label: 'Teams',
        children: [
          assign({}, globalFields.teams, {
            name: 'teams',
            label: 'Team',
            isLabelHidden: true,
            persistsConditionalValue: true,
            optional: true,
          }),
        ],
        modifier: 'subfield',
        condition: {
          name: 'event_shared',
          value: 'true',
        },
      },
      {
        macroName: 'AddAnother',
        buttonName: 'add_related_programme',
        name: 'related_programmes',
        label: 'Related programmes',
        children: [
          assign({}, globalFields.programmes, {
            name: 'related_programmes',
            label: 'Related programmes',
            isLabelHidden: true,
            optional: true,
          }),
        ],
      },
    ],
  }
}

module.exports = eventFormConfig
