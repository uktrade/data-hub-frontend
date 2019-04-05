const { assign } = require('lodash')

const labels = require('../labels')
const {
  contact,
  communicationChannel,
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
  services = [],
  teams = [],
  channels = [],
  advisers = [],
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
      service(services),
      communicationChannel(channels),
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
        label: labels.interaction[field.name],
      })
    }),
  }
}
