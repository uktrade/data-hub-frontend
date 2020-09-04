/* eslint-disable camelcase */
const { compact, get } = require('lodash')

const { INTERACTION_NAMES } = require('../constants')
const labels = require('../labels')

function transformInteractionToListItem(showCompany = true) {
  return function ({
    id,
    subject,
    kind,
    contacts,
    company,
    date,
    dit_participants,
    service,
    was_policy_feedback_provided,
  }) {
    const formatContacts = (contacts) =>
      contacts.length > 1
        ? labels.interaction.multiple_contacts
        : contacts.map((contact) => getContactName(contact))

    const getContactName = (contact) =>
      get(contact, 'name') ? contact.name : 'Unknown contact'

    const formatParticipantName = (participant) =>
      get(participant, 'adviser') && get(participant, 'team')
        ? `${participant.adviser.name}, ${participant.team.name}`
        : get(participant, 'adviser')
        ? participant.adviser.name
        : 'Unknown adviser'

    const formatParticipants = (dit_participants) =>
      dit_participants.length > 1
        ? labels.interaction.multiple_advisers
        : dit_participants.map((participant) =>
            formatParticipantName(participant)
          )

    const metaItems = [
      {
        label: labels.metaItems.type,
        value: INTERACTION_NAMES[kind],
        type: 'badge',
      },
      {
        label: labels.metaItems.type,
        value:
          was_policy_feedback_provided && INTERACTION_NAMES.policy_feedback,
        type: 'badge',
      },
      { label: labels.metaItems.date, value: date, type: 'date' },
      {
        label: labels.metaItems.contacts,
        value: contacts && formatContacts(contacts),
      },
      { label: labels.metaItems.company, value: showCompany && company },
      {
        label: labels.metaItems.dit_participants,
        value: dit_participants && formatParticipants(dit_participants),
      },
      { label: labels.metaItems.service, value: service },
    ].filter(({ value }) => !!value)

    return {
      was_policy_feedback_provided,
      id,
      type: 'interaction',
      name: subject || 'No subject',
      meta: compact(metaItems),
    }
  }
}

module.exports = transformInteractionToListItem
