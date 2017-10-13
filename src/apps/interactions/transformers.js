/* eslint-disable camelcase */
const { get, assign } = require('lodash')
const { format, isValid } = require('date-fns')

const { transformDateObjectToDateString } = require('../transformers')

function transformInteractionResponseToForm ({
  id,
  date,
  company,
  contact,
  dit_adviser,
  service,
  dit_team,
  communication_channel,
} = {}) {
  if (!id) return null

  const isValidDate = isValid(new Date(date))

  return {
    company: get(company, 'id'),
    contact: get(contact, 'id'),
    dit_adviser: get(dit_adviser, 'id'),
    service: get(service, 'id'),
    dit_team: get(dit_team, 'id'),
    communication_channel: get(communication_channel, 'id'),
    date: {
      day: isValidDate ? format(date, 'DD') : '',
      month: isValidDate ? format(date, 'MM') : '',
      year: isValidDate ? format(date, 'YYYY') : '',
    },
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

function transformInteractionResponseToViewRecord ({
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

function transformInteractionFormBodyToApiRequest ({ props, company }) {
  return assign({}, props, {
    company,
    date: transformDateObjectToDateString('date')(props),
  })
}

function transformInteractionListItemToHaveUrlPrefix (urlPrefix) {
  return function (item) {
    if (!urlPrefix) return item
    return assign({}, item, { urlPrefix: urlPrefix.charAt(0) === '/' ? urlPrefix.substring(1) : urlPrefix })
  }
}

module.exports = {
  transformInteractionResponseToForm,
  transformInteractionToListItem,
  transformInteractionFormBodyToApiRequest,
  transformInteractionResponseToViewRecord,
  transformInteractionListItemToHaveUrlPrefix,
}
