/* eslint-disable camelcase */
const { assign, camelCase, get, isNil, omit, pickBy, some } = require('lodash')
const { format, isValid } = require('date-fns')

const { transformDateObjectToDateString } = require('../transformers')
const config = require('../../../config')
const labels = require('./labels')
const { INTERACTION_NAMES, IST_ONLY_SERVICES } = require('./constants')

const transformEntityLink = (entity, entityPath, noLinkText = null) => {
  return entity ? {
    url: `/${entityPath}/${entity.id}`,
    name: entity.name,
  } : noLinkText
}

const transformDocumentsLink = (archived_documents_url_path) => {
  if (archived_documents_url_path) {
    return {
      url: config.archivedDocumentsBaseUrl + archived_documents_url_path,
      name: 'View files and documents',
      hint: '(will open another website)',
      hintId: 'external-link-label',
    }
  }

  return { name: 'There are no files or documents' }
}

const transformCreatedOnDate = (service, name) => {
  if (some(IST_ONLY_SERVICES, { id: service.id })) {
    return {
      type: 'date',
      name,
    }
  }
}

function transformInteractionResponseToForm ({
  id,
  contact,
  dit_team,
  dit_adviser,
  event,
  service,
  service_delivery_status,
  grant_amount_offered,
  net_company_receipt,
  subject,
  policy_area,
  policy_issue_type,
  notes,
  date,
  company,
  communication_channel,
} = {}) {
  if (!id) return null

  const isValidDate = isValid(new Date(date))

  return {
    id,
    subject,
    notes,
    grant_amount_offered,
    net_company_receipt,
    contact: get(contact, 'id'),
    dit_team: get(dit_team, 'id'),
    dit_adviser: get(dit_adviser, 'id'),
    is_event: isNil(event) ? 'false' : 'true',
    event: get(event, 'id'),
    service: get(service, 'id'),
    service_delivery_status: get(service_delivery_status, 'id'),
    policy_area: get(policy_area, 'id'),
    policy_issue_type: get(policy_issue_type, 'id'),
    date: {
      day: isValidDate ? format(date, 'DD') : '',
      month: isValidDate ? format(date, 'MM') : '',
      year: isValidDate ? format(date, 'YYYY') : '',
    },
    company: get(company, 'id'),
    communication_channel: get(communication_channel, 'id'),
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
  dit_team,
  communication_channel,
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

function transformInteractionResponseToViewRecord ({
  company,
  subject,
  notes,
  created_on,
  date,
  dit_adviser,
  service,
  service_delivery_status,
  grant_amount_offered,
  net_company_receipt,
  dit_team,
  contact,
  policy_issue_type,
  policy_area,
  investment_project,
  communication_channel,
  event,
  kind,
  archived_documents_url_path,
}) {
  const defaultEventText = kind === 'service_delivery' ? 'No' : null
  const kindLabels = labels[camelCase(kind)]
  const transformed = {
    company: transformEntityLink(company, 'companies'),
    contact: transformEntityLink(contact, 'contacts'),
    dit_team,
    service,
    service_delivery_status,
    policy_issue_type,
    policy_area,
    grant_amount_offered: grant_amount_offered ? {
      type: 'currency',
      name: grant_amount_offered,
    } : null,
    net_company_receipt: net_company_receipt ? {
      type: 'currency',
      name: net_company_receipt,
    } : null,
    subject,
    notes,
    created_on: transformCreatedOnDate(service, created_on),
    date: {
      type: 'date',
      name: date,
    },
    dit_adviser,
    investment_project: transformEntityLink(investment_project, 'investment-projects'),
    event: transformEntityLink(event, 'events', defaultEventText),
    communication_channel: communication_channel,
    documents: transformDocumentsLink(archived_documents_url_path),
  }

  const result = {}
  Object.keys(transformed).forEach((key) => {
    const label = kindLabels[key]
    if (label) {
      result[label] = transformed[key]
    }
  })

  return pickBy(result)
}

function transformInteractionFormBodyToApiRequest (props) {
  return omit({
    ...props,
    date: transformDateObjectToDateString('date')(props),
    grant_amount_offered: props.grant_amount_offered || null,
    net_company_receipt: props.net_company_receipt || null,
  }, ['date_day', 'date_month', 'date_year'])
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
