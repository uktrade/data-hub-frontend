/* eslint-disable camelcase */

const { INTERACTION_NAMES } = require('../constants')
const { interaction } = require('../labels')

function transformInteractionToListItem ({
  id,
  subject,
  kind,
  contacts,
  company,
  date,
  dit_adviser,
  dit_team,
  service,
  was_policy_feedback_provided,
}) {
  const hasMultipleContacts = (contacts) => {
    return contacts.length > 1 ? interaction.multiple_contacts : contacts.map(contact => contact.name)
  }
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
