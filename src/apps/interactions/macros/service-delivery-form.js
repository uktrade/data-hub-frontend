const { assign } = require('lodash')

const labels = require('../labels')
const {
  contact,
  service,
  subject,
  notes,
  date,
  adviser,
  policyAreas,
  feedbackPolicyRequest,
  feedbackPolicyIssueType,
  feedbackPolicyNotes,
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
  areas,
  types,
}) {
  return {
    returnLink,
    returnText,
    buttonText,
    hiddenFields,
    children: [
      date,
      contact(contacts),
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
      feedbackPolicyRequest,
      feedbackPolicyIssueType(types),
      {
        ...policyAreas(areas),
        modifier: 'subfield',
        condition: {
          name: 'was_policy_feedback_provided',
          value: 'true',
        },
      },
      feedbackPolicyNotes,
    ].map(field => {
      return assign(field, {
        label: labels.serviceDelivery[field.name],
      })
    }),
  }
}
