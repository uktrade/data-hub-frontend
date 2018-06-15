/* eslint-disable camelcase */
const { camelCase, pickBy, some } = require('lodash')

const config = require('../../../../config')
const labels = require('../labels')
const { IST_ONLY_SERVICES } = require('../constants')

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

function transformInteractionResponseToViewRecord ({
  company,
  subject,
  notes,
  date,
  dit_adviser,
  service,
  service_delivery_status,
  grant_amount_offered,
  net_company_receipt,
  dit_team,
  contact,
  created_on,
  policy_issue_type,
  policy_areas,
  investment_project,
  communication_channel,
  event,
  kind,
  archived_documents_url_path,
}) {
  const defaultEventText = kind === 'service_delivery' ? 'No' : null
  const kindLabels = labels[camelCase(kind)]
  const displayPolicyAreas = (policy_areas || [])
    .map(policy_area => policy_area.name)
    .join(', ')

  const transformCreatedOnDate = (service, name) => {
    if (some(IST_ONLY_SERVICES, { id: service.id })) {
      return {
        type: 'date',
        name,
      }
    }
  }

  const transformed = {
    company: transformEntityLink(company, 'companies'),
    contact: transformEntityLink(contact, 'contacts'),
    dit_team,
    service,
    service_delivery_status,
    policy_issue_type,
    policy_areas: displayPolicyAreas,
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

module.exports = transformInteractionResponseToViewRecord
