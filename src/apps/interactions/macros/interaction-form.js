const { assign } = require('lodash')

const labels = require('../labels')
const {
  contact,
  communicationChannel,
  service,
  subject,
  notes,
  date,
  serviceHeading,
  participantsHeading,
  detailsHeading,
  notesHeading,
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
  company,
}) {
  return {
    returnLink,
    returnText,
    buttonText,
    hiddenFields,
    children: [
      serviceHeading,
      ...service(services),
      participantsHeading(company),
      contact(contacts),
      adviser(advisers),
      detailsHeading,
      date,
      communicationChannel(channels),
      notesHeading,
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
        label: field.label || labels.interaction[field.name],
      })
    }),
  }
}
