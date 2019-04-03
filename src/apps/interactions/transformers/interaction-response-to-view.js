/* eslint-disable camelcase */
const { camelCase, pickBy, get } = require('lodash')

const config = require('../../../../config')
const labels = require('../labels')

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
  dit_participants,
  service,
  service_delivery_status,
  grant_amount_offered,
  net_company_receipt,
  contacts,
  policy_areas,
  policy_issue_types,
  was_policy_feedback_provided,
  policy_feedback_notes,
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

  const displayPolicyTypes = (policy_issue_types || [])
    .map(policy_type => policy_type.name)
    .join(', ')
  const hasTeam = (name) => get(name, 'team') ? `${name.adviser.name}, ${name.team.name}` : name.adviser.name
  const displayDitParticipants = (dit_participants || []).map(ditParticipant => hasTeam(ditParticipant))

  const transformed = {
    company: transformEntityLink(company, 'companies'),
    contacts: contacts.map(contact => transformEntityLink(contact, 'contacts')),
    service,
    service_delivery_status,
    grant_amount_offered: grant_amount_offered ? {
      type: 'currency',
      name: grant_amount_offered,
    } : null,
    net_company_receipt: net_company_receipt ? {
      type: 'currency',
      name: net_company_receipt,
    } : null,
    subject,
    notes: notes,
    date: {
      type: 'date',
      name: date,
    },
    dit_participants: displayDitParticipants,
    investment_project: transformEntityLink(investment_project, 'investments/projects'),
    event: transformEntityLink(event, 'events', defaultEventText),
    communication_channel: communication_channel,
    documents: transformDocumentsLink(archived_documents_url_path),
    policy_issue_types: displayPolicyTypes,
    policy_areas: displayPolicyAreas,
    policy_feedback_notes: policy_feedback_notes,
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
