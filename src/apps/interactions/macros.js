const { assign } = require('lodash')

const formLabels = require('./labels')
const metaData = require('../../lib/metadata')
const { transformContactToOption, transformObjectToOption } = require('../transformers')

const interactionSortForm = {
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
        { value: 'date:desc', label: 'Newest' },
        { value: 'date:asc', label: 'Oldest' },
        { value: 'company.name:asc', label: 'Company: A-Z' },
        { value: 'company.name:desc', label: 'Company: Z-A' },
        { value: 'contact.name:asc', label: 'Contact: A-Z' },
        { value: 'contact.name:desc', label: 'Contact: Z-A' },
        { value: 'dit_adviser.name:asc', label: 'Adviser: A-Z' },
        { value: 'dit_adviser.name:desc', label: 'Adviser: Z-A' },
        { value: 'subject:asc', label: 'Subject: A-Z' },
        { value: 'subject:desc', label: 'Subject: Z-A' },
      ],
    },
  ],
}

const selectKindFormConfig = function ({
  returnLink,
  errors = [],
}) {
  return {
    buttonText: 'Continue',
    errors,
    children: [
      {
        macroName: 'MultipleChoiceField',
        type: 'radio',
        label: 'What would you like to record?',
        name: 'kind',
        options: [{
          value: 'interaction',
          label: 'A standard interaction',
          hint: 'For example a meeting or email exchange with a customer',
        }, {
          value: 'service_delivery',
          label: 'A service that has been provided',
          hint: 'For example account management, a significant assist or an event',
        }],
      },
    ],
  }
}

const interactionFields = {
  contact (contacts) {
    return {
      macroName: 'MultipleChoiceField',
      name: 'contact',
      initialOption: '-- Select contact --',
      options () {
        return contacts.map(transformContactToOption)
      },
    }
  },
  provider: {
    macroName: 'MultipleChoiceField',
    name: 'dit_team',
    initialOption: '-- Select provider --',
    options () {
      return metaData.teams.map(transformObjectToOption)
    },
  },
  service (services) {
    return {
      macroName: 'MultipleChoiceField',
      name: 'service',
      initialOption: '-- Select service --',
      options () {
        return services.map(transformObjectToOption)
      },
    }
  },
  subject: {
    macroName: 'TextField',
    name: 'subject',
  },
  notes: {
    macroName: 'TextField',
    type: 'textarea',
    name: 'notes',
  },
  date: {
    macroName: 'DateFieldset',
    name: 'date',
  },
  adviser (advisers) {
    return {
      macroName: 'MultipleChoiceField',
      name: 'dit_adviser',
      initialOption: '-- Select adviser --',
      options () {
        return advisers.map(transformContactToOption)
      },
    }
  },
  communicationChannel: {
    macroName: 'MultipleChoiceField',
    name: 'communication_channel',
    initialOption: '-- Select communication channel --',
    options () {
      return metaData.communicationChannelOptions.map(transformObjectToOption)
    },
  },
}

const interactionFormConfig = function ({
  returnLink,
  contacts = [],
  advisers = [],
  services = [],
  hiddenFields,
}) {
  return {
    returnLink,
    buttonText: 'Save',
    returnText: 'Cancel',
    hiddenFields,
    children: [
      interactionFields.contact(contacts),
      interactionFields.provider,
      interactionFields.service(services),
      interactionFields.subject,
      interactionFields.notes,
      interactionFields.date,
      interactionFields.adviser(advisers),
      interactionFields.communicationChannel,
    ].map(field => {
      return assign(field, {
        label: formLabels.interaction[field.name],
      })
    }),
  }
}

const serviceDeliveryFormConfig = function ({
  returnLink,
  contacts = [],
  advisers = [],
  services = [],
  events = [],
  hiddenFields,
}) {
  return {
    returnLink,
    buttonText: 'Save',
    returnText: 'Cancel',
    hiddenFields,
    children: [
      interactionFields.contact(contacts),
      interactionFields.provider,
      // TODO this will be going once interactions are within events
      {
        macroName: 'MultipleChoiceField',
        type: 'radio',
        name: 'is_event',
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
        macroName: 'MultipleChoiceField',
        name: 'event',
        initialOption: '-- Select event --',
        options () {
          return events.map(transformObjectToOption)
        },
        modifier: 'subfield',
        condition: {
          name: 'is_event',
          value: 'true',
        },
      },
      interactionFields.service(services),
      interactionFields.subject,
      interactionFields.notes,
      interactionFields.date,
      interactionFields.adviser(advisers),
    ].map(field => {
      return assign(field, {
        label: formLabels.serviceDelivery[field.name],
      })
    }),
  }
}

module.exports = {
  interactionSortForm,
  selectKindFormConfig,
  interactionFormConfig,
  serviceDeliveryFormConfig,
}
