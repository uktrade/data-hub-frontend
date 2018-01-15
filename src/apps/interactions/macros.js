const { assign } = require('lodash')

const formLabels = require('./labels')
const currentYear = (new Date()).getFullYear()

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
          hint: 'For example, an email, phone call or meeting',
        }, {
          value: 'service_delivery',
          label: 'A service that you have provided',
          hint: 'For example, account management, a significant assist or an event',
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
      options: contacts,
    }
  },
  provider (teams) {
    return {
      macroName: 'MultipleChoiceField',
      name: 'dit_team',
      initialOption: '-- Select provider --',
      options: teams,
    }
  },
  service (services) {
    return {
      macroName: 'MultipleChoiceField',
      name: 'service',
      initialOption: '-- Select service --',
      options: services,
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
      options: advisers,
    }
  },
  communicationChannel (channels) {
    return {
      macroName: 'MultipleChoiceField',
      name: 'communication_channel',
      initialOption: '-- Select communication channel --',
      options: channels,
    }
  },
}

const interactionFiltersFieldConfig = function (advisers = [], channels = [], teams = []) {
  return [
    {
      macroName: 'MultipleChoiceField',
      name: 'kind',
      type: 'checkbox',
      options: [
        { value: 'interaction', label: 'Interaction' },
        { value: 'service_delivery', label: 'Service delivery' },
      ],
    },
    assign(
      {},
      interactionFields.communicationChannel(channels),
      { initialOption: '-- All channels --' }
    ),
    assign(
      {},
      interactionFields.adviser(advisers),
      { initialOption: '-- All advisers --' }
    ),
    {
      macroName: 'TextField',
      name: 'date_after',
      hint: 'YYYY-MM-DD',
      placeholder: `e.g. ${currentYear}-07-18`,
    },
    {
      macroName: 'TextField',
      name: 'date_before',
      hint: 'YYYY-MM-DD',
      placeholder: `e.g. ${currentYear}-07-21`,
    },
    assign(
      {},
      interactionFields.provider(teams),
      { initialOption: '-- All providers --' }
    ),
  ].map(filter => {
    return assign(filter, {
      label: formLabels.filters[filter.name],
      modifier: ['smaller', 'light'],
    })
  })
}

const interactionFormConfig = function ({
  returnLink,
  contacts = [],
  advisers = [],
  services = [],
  teams = [],
  channels = [],
  hiddenFields,
}) {
  return {
    returnLink,
    buttonText: 'Save',
    returnText: 'Cancel',
    hiddenFields,
    children: [
      interactionFields.contact(contacts),
      interactionFields.provider(teams),
      interactionFields.service(services),
      interactionFields.subject,
      interactionFields.notes,
      interactionFields.date,
      interactionFields.adviser(advisers),
      interactionFields.communicationChannel(channels),
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
  teams = [],
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
      interactionFields.provider(teams),
      interactionFields.adviser(advisers),
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
        options: events,
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
    ].map(field => {
      return assign(field, {
        label: formLabels.serviceDelivery[field.name],
      })
    }),
  }
}

module.exports = {
  interactionFiltersFieldConfig,
  interactionSortForm,
  selectKindFormConfig,
  interactionFormConfig,
  serviceDeliveryFormConfig,
}
