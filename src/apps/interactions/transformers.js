/* eslint-disable camelcase */

function transformInteractionToListItem (interaction) {
  return {
    id: interaction.id,
    type: 'interaction',
    name: interaction.subject,
    meta: [
      {
        label: 'Type',
        type: 'badge',
        value: interaction.interaction_type,
      },
      {
        label: 'Contact',
        value: interaction.contact,
      },
      {
        label: 'Company',
        value: interaction.company,
      },
      {
        label: 'Date',
        value: interaction.date,
        type: 'date',
      },
      {
        label: 'Adviser',
        value: interaction.dit_adviser,
      },
    ],
  }
}

module.exports = {
  transformInteractionToListItem,
}
