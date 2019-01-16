/* eslint-disable camelcase */

const { INTERACTION_NAMES } = require('../constants')

function transformInteractionToListItem ({
  id,
  subject,
  kind,
  contact,
  company,
  date,
  dit_adviser,
  dit_team,
  service,
  was_policy_feedback_provided,
}) {
  return {
    was_policy_feedback_provided,
    id,
    type: 'interaction',
    name: subject || 'No subject',
    meta: [
      {
        label: 'Type',
        type: 'badge',
        value: INTERACTION_NAMES[kind],
      },
      {
        label: 'Date',
        value: date,
        type: 'date',
      },
      {
        label: 'Contact',
        value: contact,
      },
      {
        label: 'Company',
        value: company,
      },
      {
        label: 'Adviser',
        value: dit_adviser,
      },
      {
        label: 'Service provider',
        value: dit_team,
      },
      {
        label: 'Service',
        value: service,
      },
    ].concat(was_policy_feedback_provided ? {
      label: 'Type',
      type: 'badge',
      value: INTERACTION_NAMES.policy_feedback,
    } : null),
  }
}

module.exports = transformInteractionToListItem
