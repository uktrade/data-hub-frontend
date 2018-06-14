/* eslint-disable camelcase */
const { get, isNil } = require('lodash')
const { format, isValid } = require('date-fns')

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
  policy_areas,
  policy_issue_type,
  notes,
  date,
  company,
  communication_channel,
} = {}) {
  if (!id) return null

  const isValidDate = isValid(new Date(date))
  const displayPolicyAreas = (policy_areas || []).map(policy_area => policy_area.id)

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
    policy_areas: displayPolicyAreas,
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

module.exports = transformInteractionResponseToForm
