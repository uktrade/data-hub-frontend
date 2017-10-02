const { get } = require('lodash')
const formLabels = require('./labels')
const metaData = require('../../lib/metadata')
const { transformContactToOption, transformObjectToOption } = require('../transformers')

const interactionEditFormConfig = function ({
  returnLink,
  contacts = [],
  advisers = [],
  services = [],
}) {
  return {
    returnLink,
    buttonText: 'Save',
    returnText: 'Cancel',
    children: [
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
      {
        macroName: 'MultipleChoiceField',
        name: 'service',
        label: formLabels.service,
        initialOption: '-- Select service --',
        options () {
          return services.map(transformObjectToOption)
        },
      },
      {
        macroName: 'MultipleChoiceField',
        name: 'dit_team',
        label: formLabels.dit_team,
        initialOption: '-- Select provider --',
        options () {
          return metaData.teams.map(transformObjectToOption)
        },
      },
    ],
  }
}

module.exports = {
  interactionEditFormConfig,
}
