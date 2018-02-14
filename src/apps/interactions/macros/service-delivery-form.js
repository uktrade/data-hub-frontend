const { assign, join } = require('lodash')

const labels = require('../labels')
const {
  contact,
  provider,
  service,
  subject,
  notes,
  date,
  adviser,
} = require('./fields')

module.exports = function ({
  returnLink,
  contacts = [],
  advisers = [],
  services = [],
  tapServices = [],
  statuses = [],
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
      contact(contacts),
      provider(teams),
      adviser(advisers),
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
      service(services),
      {
        macroName: 'MultipleChoiceField',
        name: 'service_delivery_status',
        initialOption: '-- Select service status --',
        options: statuses,
        optional: true,
        modifier: ['subfield', 'medium'],
        condition: {
          name: 'service',
          value: tapServices.join('||'),
        },
      },
      subject,
      notes,
      date,
    ].map(field => {
      return assign(field, {
        label: labels.serviceDelivery[field.name],
      })
    }),
  }
}
