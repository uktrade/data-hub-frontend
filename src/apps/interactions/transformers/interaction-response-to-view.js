/* eslint-disable camelcase */
const { camelCase, pickBy, get } = require('lodash')

const config = require('../../../../config')
const labels = require('../labels')
const { getDataLabels } = require('../../../lib/controller-utils')

const transformEntityLink = (entity, entityPath, noLinkText = null) => {
  return entity
    ? {
      url: `/${entityPath}/${entity.id}`,
      name: entity.name,
    }
    : noLinkText
}

const transformDocumentsLink = archived_documents_url_path => {
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

function transformInteractionResponseToViewRecord (
  {
    company,
    notes,
    date,
    dit_participants,
    service = {},
    service_delivery_status,
    grant_amount_offered,
    net_company_receipt,
    contacts,
    policy_areas,
    policy_issue_types,
    policy_feedback_notes,
    investment_project,
    communication_channel,
    event,
    kind,
    archived_documents_url_path,
  },
  canShowDocuments = false
) {
  const defaultEventText = kind === 'service_delivery' ? 'No' : null
  const kindLabels = labels[camelCase(kind)]
  const formattedPolicyAreas = (policy_areas || [])
    .map(policy_area => policy_area.name)
    .join(', ')
  const formattedPolicyTypes = (policy_issue_types || [])
    .map(policy_type => policy_type.name)
    .join(', ')

  const formatParticipantName = participant =>
    get(participant, 'team')
      ? `${participant.adviser.name}, ${participant.team.name}`
      : participant.adviser.name

  const formattedParticipants = (dit_participants || []).map(participant =>
    formatParticipantName(participant)
  )

  const getServiceValues = () => {
    if (!service) return
    const excludedServiceStrings = [
      'A Specific DIT Export Service or Funding',
      'A Specific Service',
      'Enquiry or Referral Received',
      'Enquiry Received',
    ]

    const splitServiceName = service.name.split(' : ')
    const serviceName =
      splitServiceName[1] &&
      excludedServiceStrings.includes(splitServiceName[0])
        ? splitServiceName[1]
        : service.name

    return {
      ...service,
      name: serviceName,
    }
  }

  const viewRecord = {
    company: transformEntityLink(company, 'companies'),
    contacts: contacts.map(contact => transformEntityLink(contact, 'contacts')),
    service: getServiceValues(),
    service_delivery_status,
    grant_amount_offered: grant_amount_offered
      ? {
        type: 'currency',
        name: grant_amount_offered,
      }
      : null,
    net_company_receipt: net_company_receipt
      ? {
        type: 'currency',
        name: net_company_receipt,
      }
      : null,
    notes: notes,
    date: {
      type: 'date',
      name: date,
    },
    dit_participants: formattedParticipants,
    investment_project: transformEntityLink(
      investment_project,
      'investments/projects'
    ),
    event: transformEntityLink(event, 'events', defaultEventText),
    communication_channel: communication_channel,
    documents: canShowDocuments
      ? transformDocumentsLink(archived_documents_url_path)
      : null,
    policy_issue_types: formattedPolicyTypes,
    policy_areas: formattedPolicyAreas,
    policy_feedback_notes: policy_feedback_notes,
  }

  return pickBy(getDataLabels(viewRecord, kindLabels))
}

module.exports = transformInteractionResponseToViewRecord
