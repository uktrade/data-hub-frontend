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
  eventDetails = [],
  hiddenFields,
}) {
  return {
    returnLink,
    returnText,
    buttonText,
    hiddenFields: assign(hiddenFields, { is_event: true }),
    children: [
      {
        macroName: 'MultipleChoiceField',
        name: 'event',
        initialOption: '-- Select event --',
        options: events,
      },
      /**
       * `FormItemDetails` fetches an item details through an individual async api call.
       * `target` param must be identical with the `name` param of the form item we're requesting the details for.
       */
      {
        macroName: 'FormItemDetails',
        name: 'event_details',
        label: 'Event Details',
        options: eventDetails,
        target: 'event',
      },
      contact(contacts),

      /**
       * Populate the commented fields below (provider, adviser, service) with the values from the event async response
       */
      // provider(teams),
      // adviser(advisers),
      // service(services),

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
