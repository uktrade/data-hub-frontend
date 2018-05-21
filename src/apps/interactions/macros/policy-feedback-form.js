const { assign } = require('lodash')

const labels = require('../labels')
const {
  contact,
  communicationChannel,
  provider,
  policyIssueType,
  policyArea,
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
  types = [],
  areas = [],
  teams = [],
  channels = [],
  hiddenFields,
}) {
  return {
    returnLink,
    buttonText,
    returnText,
    hiddenFields,
    children: [
      contact(contacts),
      provider(teams),
      policyIssueType(types),
      policyArea(areas),
      subject,
      notes,
      date,
      adviser(advisers),
      communicationChannel(channels),
    ].map(field => {
      return assign(field, {
        label: labels.policyFeedback[field.name],
      })
    }),
  }
}
