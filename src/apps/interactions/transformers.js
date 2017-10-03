/* eslint-disable camelcase */
const { get, assign } = require('lodash')
const dateFns = require('date-fns')

const { transformDateObjectToDateString } = require('../transformers')

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
  kind,
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
        value: (kind === 'interaction') ? 'Interaction' : 'Service delivery',
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

function transformInteractionFormBodyToApiRequest ({ props, company, communicationChannel }) {
  return assign({}, props, {
    date: transformDateObjectToDateString('date')(props),
    company: company,
    communication_channel: communicationChannel,
  })
}

module.exports = {
  transformInteractionResponseToForm,
  transformInteractionToListItem,
  transformInteractionFormBodyToApiRequest,
}
