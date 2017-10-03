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

function transformInteractionResponsetoViewRecord ({
  company,
  subject,
  notes,
  date,
  dit_adviser,
  service,
  dit_team,
  contact,
  investment_project,
  communication_channel,
  event,
  kind,
}) {
  const contactLink = contact ? {
    url: `/contacts/${contact.id}`,
    name: contact.name,
  } : null

  const companyLink = company ? {
    url: `/companies/${company.id}`,
    name: company.name,
  } : null

  const investmentProjectLink = investment_project ? {
    url: `/investment-projects/${investment_project.id}`,
    name: investment_project.name,
  } : null

  const viewRecord = {
    'Company': companyLink,
    'Contact': contactLink,
    'Service provider': dit_team,
    'Service': service,
    'Subject': subject,
    'Notes': notes,
    'Interaction date': {
      type: 'date',
      name: date,
    },
    'DIT adviser': dit_adviser,
    'Investment project': investmentProjectLink,
  }

  if (kind === 'service_delivery') {
    viewRecord['Event'] = event ? {
      url: `/events/${event.id}`,
      name: event.name,
    } : null
  } else {
    viewRecord['Communication channel'] = communication_channel
  }

  return viewRecord
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
  transformInteractionResponsetoViewRecord,
}
