/* eslint-disable camelcase */
const dateFns = require('date-fns')
const { mediumDateTimeFormat } = require('../../../config')

function transformInteractionToListItem (interaction) {
  return {
    id: interaction.id,
    type: 'interaction',
    name: interaction.subject,
    meta: [
      {
        label: 'Type:',
        type: 'badge',
        value: interaction.interaction_type,
      },
      {
        label: 'Contact:',
        value: interaction.contact,
      },
      {
        label: 'Company',
        value: interaction.company,
      },
      {
        label: 'Date',
        value: dateFns.format(interaction.date, mediumDateTimeFormat),
      },
      {
        label: 'Adviser:',
        value: interaction.dit_adviser,
      },
    ],
  }
}

module.exports = {
  transformInteractionToListItem,
}
