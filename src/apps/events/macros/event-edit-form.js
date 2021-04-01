const { assign, sortBy } = require('lodash')
const { globalFields } = require('../../macros')
const urls = require('../../../lib/urls')

const eventFormConfig = (
  {
    eventId,
    advisers,
    eventTypes,
    locationTypes,
    countries,
    teams,
    services,
    programmes,
    ukRegions,
  },
  featureFlags
) => {
  let children
  if (featureFlags && featureFlags.relatedTradeAgreements) {
    children = [
      {
        macroName: 'MultipleChoiceField',
        type: 'radio',
        name: 'related_trade_agreements_exist',
        label: 'Are there related Trade Agreements',
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
        buttonName: 'add_related_trade_agreement',
        name: 'related_trade_agreements',
        label: 'Related Trade Agreements',
        children: [
          assign({}, globalFields.tradeAgreements, {
            name: 'related_trade_agreements',
            label: 'Related Trade Agreements',
            isLabelHidden: true,
            options: [
              {
                label: 'Australia',
                value: '50370070-71f9-4ada-ae2c-cd0a737ba5e2',
              },
              {
                label: 'Canada',
                value: '50cf99fd-1150-421d-9e1c-b23750ebf5ca',
              },
              {
                label: 'India',
                value: '95ca9dcb-0da5-4bc2-a139-3e5b55c882f7',
              },
              {
                label: 'Japan',
                value: '05587f64-b976-425e-8763-3557c7936632',
              },
              {
                label: 'Mexico',
                value: '09787712-0d94-4137-a5f3-3f9131e681f0',
              },
              {
                label: 'New Zealand',
                value: 'f42da892-2b03-4f88-8a61-9efd8b132776',
              },
              {
                label: 'USA',
                value: '20e08a38-95a8-4250-bd5b-9d7f0dfc9387',
              },
            ],
          }),
        ],
        modifier: 'subfield',
        condition: {
          name: 'related_trade_agreements_exist',
          value: 'true',
        },
      },
      {
        macroName: 'TextField',
        name: 'name',
        label: 'Event name',
      },
      assign({}, globalFields.eventTypes, {
        options: { ...eventTypes },
      }),
      {
        macroName: 'DateFieldset',
        name: 'start_date',
        label: 'Event start date',
      },
      {
        macroName: 'DateFieldset',
        name: 'end_date',
        label: 'Event end date',
      },
      assign({}, globalFields.locationTypes, {
        label: 'Event location type',
        optional: true,
        options: { ...locationTypes },
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
        options: { ...countries },
      }),
      assign({}, globalFields.ukRegions, {
        condition: {
          name: 'address_country',
          value: '80756b9a-5d95-e211-a939-e4115bead28a',
        },
        options: { ...ukRegions },
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
        optional: false,
        options: { ...teams },
      }),
      assign({}, globalFields.serviceDeliveryServices, {
        options: sortBy(services, (option) => option.label),
      }),
      {
        macroName: 'Typeahead',
        name: 'organiser',
        entity: 'adviser',
        label: 'Organiser',
        classes: 'c-form-group c-form-group--no-filter',
        placeholder: 'Search organiser',
        multipleSelect: false,
        options: { ...advisers },
        target: 'metadata',
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
            options: { ...teams },
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
            options: { ...programmes },
          }),
        ],
      },
    ]
  } else {
    children = [
      {
        macroName: 'TextField',
        name: 'name',
        label: 'Event name',
      },
      assign({}, globalFields.eventTypes, {
        options: { ...eventTypes },
      }),
      {
        macroName: 'DateFieldset',
        name: 'start_date',
        label: 'Event start date',
      },
      {
        macroName: 'DateFieldset',
        name: 'end_date',
        label: 'Event end date',
      },
      assign({}, globalFields.locationTypes, {
        label: 'Event location type',
        optional: true,
        options: { ...locationTypes },
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
        options: { ...countries },
      }),
      assign({}, globalFields.ukRegions, {
        condition: {
          name: 'address_country',
          value: '80756b9a-5d95-e211-a939-e4115bead28a',
        },
        options: { ...ukRegions },
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
        optional: false,
        options: { ...teams },
      }),
      assign({}, globalFields.serviceDeliveryServices, {
        options: sortBy(services, (option) => option.label),
      }),
      {
        macroName: 'Typeahead',
        name: 'organiser',
        entity: 'adviser',
        label: 'Organiser',
        classes: 'c-form-group c-form-group--no-filter',
        placeholder: 'Search organiser',
        multipleSelect: false,
        options: advisers,
        target: 'metadata',
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
            options: { ...teams },
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
            options: { ...programmes },
          }),
        ],
      },
    ]
  }

  return {
    method: 'post',
    buttonText: eventId ? 'Save and return' : 'Add event',
    returnText: eventId ? 'Return without saving' : 'Cancel',
    returnLink: eventId ? urls.events.details(eventId) : urls.events.index,
    hiddenFields: {
      id: eventId,
    },
    children: children,
  }
}

module.exports = eventFormConfig
