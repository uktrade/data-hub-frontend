const { assign } = require('lodash')

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
  returnText,
  buttonText,
  contacts = [],
  advisers = [],
  services = [],
  tapServices = [],
  successfulServiceStatuses = [],
  statuses = [],
  teams = [],
  events = [],
  hiddenFields,
}) {
  return {
    returnLink,
    returnText,
    buttonText,
    hiddenFields: assign(hiddenFields, { is_event: false }),
    children: [
      adviser(advisers),
      provider(teams),
      service(services),
      contact(contacts),
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
      {
        macroName: 'TextField',
        name: 'grant_amount_offered',
        optional: true,
        modifier: ['subfield', 'medium'],
        condition: {
          name: 'service',
          value: tapServices.join('||'),
        },
      },
      {
        macroName: 'TextField',
        name: 'net_company_receipt',
        optional: true,
        modifier: ['subfield', 'medium'],
        condition: {
          name: 'service_delivery_status',
          value: successfulServiceStatuses.join('||'),
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
