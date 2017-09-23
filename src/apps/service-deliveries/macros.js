const { assign, get } = require('lodash')
const { globalFields } = require('../macros')
const formLabels = require('./labels')
const metadata = require('../../lib/metadata')
const { transformContactToOption, transformObjectToOption } = require('../transformers')

const serviceDeliveryEditFormConfig = function ({
  services,
  contacts,
  advisers,
} = {}) {
  services = services || []
  contacts = contacts || []
  advisers = advisers || []

  return {
    buttonText: 'Save',
    returnText: 'Cancel',
    children: [
      {
        macroName: 'MultipleChoiceField',
        name: 'dit_team',
        label: formLabels.dit_team,
        initialOption: '-- Select provider --',
        options () {
          return metadata.teams.map(transformObjectToOption)
        },
      },
      {
        macroName: 'MultipleChoiceField',
        name: 'service',
        label: formLabels.service,
        initialOption: '-- Select service --',
        options () {
          return services.map(transformObjectToOption)
        },
      },
      globalFields.events,
      globalFields.serviceDeliveryStatuses,
      {
        macroName: 'TextField',
        name: 'subject',
        label: formLabels.subject,
      },
      {
        macroName: 'TextField',
        type: 'textarea',
        name: 'notes',
        label: formLabels.notes,
      },
      {
        macroName: 'DateFieldset',
        name: 'date',
        label: formLabels.date,
      },
      {
        macroName: 'MultipleChoiceField',
        name: 'contact',
        label: formLabels.contact,
        optional: true,
        initialOption: '-- Select contact --',
        options () {
          return contacts.map(transformContactToOption)
        },
      },
      {
        macroName: 'MultipleChoiceField',
        name: 'dit_adviser',
        label: formLabels.dit_adviser,
        optional: true,
        initialOption: '-- Select adviser --',
        options () {
          return get(advisers, 'results', []).map(transformContactToOption)
        },
      },
      globalFields.ukRegions,
      globalFields.sectors,
      assign({}, globalFields.countries, {
        name: 'country_of_interest',
        label: formLabels.country_of_interest,
      }),
    ],
  }
}

module.exports = {
  serviceDeliveryEditFormConfig,
}
