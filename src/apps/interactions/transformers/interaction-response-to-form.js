/* eslint-disable camelcase */
const { get, isNil } = require('lodash')
const { format, isValid } = require('date-fns')

function transformInteractionResponseToForm ({
  id,
  contacts,
  dit_participants,
  event,
  service,
  service_answers,
  service_delivery_status,
  grant_amount_offered,
  net_company_receipt,
  subject,
  policy_areas,
  policy_issue_types,
  policy_feedback_notes,
  was_policy_feedback_provided,
  notes,
  date,
  company,
  communication_channel,
  kind,
} = {}) {
  if (!id) return null
  const isValidDate = isValid(new Date(date))
  const displayPolicyAreas = (policy_areas || []).map(policy_area => policy_area.id)
  const displayPolicyTypes = (policy_issue_types || []).map(policy_type => policy_type.id)
  const displayContactTypes = (contacts || []).map(contact => contact.id)
  const displayDitParticipants = (dit_participants || []).map(ditParticipant => ditParticipant.adviser.id)
  const serviceAnswers = {}

  if (serviceAnswers.length) {
    for (let [questionKey, questionValue] of Object.entries(service_answers)) {
      for (let [answerKey] of Object.entries(questionValue)) {
        serviceAnswers[questionKey] = answerKey
      }
    }
  }

  return {
    id,
    subject,
    notes,
    grant_amount_offered,
    net_company_receipt,
    contacts: displayContactTypes,
    dit_participants: displayDitParticipants,
    is_event: isNil(event) ? 'false' : 'true',
    event: get(event, 'id'),
    service: get(service, 'id'),
    ...serviceAnswers,
    service_delivery_status: get(service_delivery_status, 'id'),
    policy_areas: displayPolicyAreas,
    policy_issue_types: displayPolicyTypes,
    policy_feedback_notes,
    was_policy_feedback_provided: was_policy_feedback_provided ? 'true' : 'false',
    date: {
      day: isValidDate ? format(date, 'DD') : '',
      month: isValidDate ? format(date, 'MM') : '',
      year: isValidDate ? format(date, 'YYYY') : '',
    },
    company: get(company, 'id'),
    communication_channel: get(communication_channel, 'id'),
    kind,
  }
}

module.exports = transformInteractionResponseToForm
