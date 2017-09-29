/* eslint-disable camelcase */
const { get } = require('lodash')
const dateFns = require('date-fns')

function transformInteractionResponseToForm ({
  interaction_type,
  company,
  subject,
  notes,
  contact,
  date,
  dit_adviser,
  service,
  dit_team,
}) {
  return {
    interaction_type: get(interaction_type, 'id'),
    company: get(company, 'id'),
    subject,
    notes,
    contact: get(contact, 'id'),
    date: {
      day: dateFns.format(date, 'DD'),
      month: dateFns.format(date, 'MM'),
      year: dateFns.format(date, 'YYYY'),
    },
    dit_adviser: get(dit_adviser, 'id'),
    service: get(service, 'id'),
    dit_team: get(dit_team, 'id'),
  }
}

function transformInteractionToListItem ({
  id,
  subject,
  interaction_type,
  contact,
  company,
  date,
  dit_adviser,
}) {
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
  transformInteractionResponseToForm,
  transformInteractionToListItem,
}
