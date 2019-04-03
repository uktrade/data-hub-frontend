/* eslint-disable camelcase */
const { get } = require('lodash')

const { INTERACTION_NAMES } = require('../constants')
const { interaction } = require('../labels')

function transformInteractionToListItem ({
  id,
  subject,
  kind,
  contacts,
  company,
  date,
  dit_participants,
  dit_team,
  service,
  was_policy_feedback_provided,
}) {
  const hasMultipleContacts = (contacts) => contacts.length > 1 ? interaction.multiple_contacts : contacts.map(contact => contact.name)
  const hasTeam = (name) => get(name, 'team') ? `${name.adviser.name}, ${name.team.name}` : name.adviser.name
  const hasMultipleAdvisers = (dit_participants) => dit_participants.length > 1 ? interaction.multiple_advisers : dit_participants.map(ditParticipant => hasTeam(ditParticipant))
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
        label: 'Contact(s)',
        value: contacts && hasMultipleContacts(contacts),
      },
      {
        label: 'Company',
        value: company,
      },
      {
        label: 'Adviser(s)',
        value: dit_participants && hasMultipleAdvisers(dit_participants),
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
