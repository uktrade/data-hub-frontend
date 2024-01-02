/* eslint-disable camelcase */
import { get } from 'lodash'

import { format } from '../../../utils/date'

import urls from '../../../../lib/urls'

import { LABELS } from './constants'

const formatContacts = (contacts) =>
  contacts.length > 1
    ? 'Multiple contacts'
    : contacts.map((contact) => getContactName(contact))

const getContactName = (contact) =>
  get(contact, 'name') ? contact.name : 'Unknown contact'

const formatParticipantName = (participant) =>
  get(participant, 'adviser') && get(participant, 'team')
    ? `${participant.adviser.name}, ${participant.team.name}`
    : get(participant, 'adviser')
      ? participant.adviser.name
      : 'Unknown adviser'

const formatParticipants = (dit_participants) =>
  dit_participants.length > 1
    ? 'Multiple advisers'
    : dit_participants.map((participant) => formatParticipantName(participant))

const getbadgeLabel = (type, hasFeedback = false) => {
  const badges = {
    interaction: LABELS.interaction,
    service_delivery: LABELS.serviceDelivery,
  }
  return [
    {
      text: badges[type],
    },
    hasFeedback && {
      text: 'Business intelligence',
    },
  ].filter(Boolean)
}

export const transformCompanyActivityToListItem = ({
  object,
  subject,
  summary,
  dit_participants,
  service,
  companies,
  id,
  type,
  contacts,
  activityType,
  was_policy_feedback_provided,
} = {}) => ({
  id,
  type,
  metadata: [
    { label: 'Name', value: object?.name },
    { label: 'Subject', value: object['dit:subject'] },
    { label: 'Summary', value: summary },
    { label: 'Date', value: format(object.startTime, 'dd MMMM yyyy') },
    {
      label: 'Contact(s)',
      value: contacts && formatContacts(contacts),
    },
    {
      label: 'Company',
      value: companies && (companies.length ? companies[0].name : null),
    },
    {
      label: 'Adviser(s)',
      value: dit_participants && formatParticipants(dit_participants),
    },
    {
      label: 'Service',
      value: service?.name,
    },
  ].filter(({ value }) => Boolean(value)),
  headingUrl: urls.interactions.detail(id),
  badges: getbadgeLabel(activityType, was_policy_feedback_provided),
  headingText: subject,
  object: object,
})

export const transformResponseToCollection = ({
  total: count,
  activities: results = [],
}) => ({
  count,
  results: results.map(transformCompanyActivityToListItem),
})

export const transformWasPolicyfeedBackProvidedToApi = (
  wasPolicyfeedbackProvided
) => wasPolicyfeedbackProvided && wasPolicyfeedbackProvided[0] === 'true'

export const filterServiceNames = (services) => {
  if (!services) return

  const excludedParentServices = [
    'A Specific DBT Export Service or Funding',
    'A Specific Service',
    'Enquiry or Referral Received',
    'Enquiry Received',
  ]
  const filteredServiceNames = services
    .map((service) => {
      const [parent, child] = service.label.split(' : ')
      const isParentExcluded = excludedParentServices.includes(parent)
      const label = isParentExcluded && child ? child : service.label
      const value = service.value
      return { label, value }
    })
    .sort((a, b) => a.label.localeCompare(b.label))

  return filteredServiceNames
}
