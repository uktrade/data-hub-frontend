/* eslint-disable camelcase */

function transformInteractionToListItem ({
  id,
  subject,
  interaction_type,
  contact,
  company,
  date,
  dit_adviser,
} = {}) {
  return {
    id,
    type: 'interaction',
    name: subject,
    meta: [
      {
        label: 'Type',
        type: 'badge',
        value: interaction_type,
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
        label: 'Date',
        value: date,
        type: 'date',
      },
      {
        label: 'Adviser',
        value: dit_adviser,
      },
    ],
  }
}

module.exports = {
  transformInteractionToListItem,
}
