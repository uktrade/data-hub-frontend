const { EXPORT_INTEREST_STATUS } = require('../../common/constants')

const countriesDiscussed = {
  were_countries_discussed: 'Were any countries discussed?',
  [EXPORT_INTEREST_STATUS.EXPORTING_TO]: 'Countries currently exporting to',
  [EXPORT_INTEREST_STATUS.FUTURE_INTEREST]: 'Future countries of interest',
  [EXPORT_INTEREST_STATUS.NOT_INTERESTED]: 'Countries not interested in',
}

const interaction = {
  company: 'Company',
  contacts: 'Contact(s)',
  service: 'Service',
  subject: 'Subject',
  notes: 'Notes',
  date: 'Date of interaction',
  dit_participants: 'Adviser(s)',
  investment_project: 'Investment project',
  communication_channel: 'Communication channel',
  policy_issue_types: 'Policy issue types',
  policy_areas: 'Policy areas',
  policy_feedback_notes: 'Business intelligence',
  multiple_contacts: 'Multiple contacts',
  multiple_advisers: 'Multiple advisers',
  created_on: 'Created on',
  was_policy_feedback_provided:
    'Did the contact provide business intelligence?',
  service_delivery_status: 'Service status',
  grant_amount_offered: 'Grant offered',
  has_related_trade_agreements:
    'Does this interaction relate to a named trade agreement?',
  related_trade_agreements: 'Named trade agreement(s)',
  has_related_opportunity:
    'Does this interaction relate to a large capital opportunity?',
  large_capital_opportunity: 'Related large capital opportunity',
  ...countriesDiscussed,
}

const serviceDelivery = {
  company: 'Company',
  contacts: 'Contact(s)',
  service: 'Service',
  service_delivery_status: 'Service status',
  grant_amount_offered: 'Grant offered',
  net_company_receipt: 'Net receipt',
  subject: 'Subject',
  notes: 'Notes',
  date: 'Date of service delivery',
  dit_participants: 'Adviser(s)',
  investment_project: 'Investment project',
  event: 'Event',
  communication_channel: 'Communication channel',
  policy_issue_types: 'Policy issue types',
  policy_areas: 'Policy areas',
  policy_feedback_notes: 'Business intelligence',
  is_event: 'Is this an event?',
  was_policy_feedback_provided:
    'Did the contact provide business intelligence?',
  has_related_trade_agreements:
    'Does this interaction relate to a named trade agreement?',
  related_trade_agreements: 'Named trade agreement(s)',
  ...countriesDiscussed,
}

const filters = {
  kind: 'Interaction type',
  communication_channel: 'Communication channel',
  dit_participants__adviser: 'Adviser(s)',
  company: 'Company',
  subject: 'Subject',
  date_after: 'From',
  date_before: 'To',
  dit_participants__team: 'Teams',
  sector_descends: 'Sector',
  service: 'Service',
  was_policy_feedback_provided: 'Business intelligence',
  policy_areas: 'Policy areas',
  policy_issue_types: 'Policy issue type',
  company_one_list_group_tier: 'Company One List group tier',
}

const metaItems = {
  type: 'Type',
  date: 'Date',
  contacts: 'Contact(s)',
  company: 'Company',
  dit_participants: 'Adviser(s)',
  dit_team: 'Service provider',
  service: 'Service',
}

module.exports = {
  interaction,
  serviceDelivery,
  filters,
  metaItems,
}
