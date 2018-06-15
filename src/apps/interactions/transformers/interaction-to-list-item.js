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
}) {
  return {
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
    ],
  }
}

module.exports = transformInteractionToListItem
