const moment = require('moment')
const { get, pick } = require('lodash')

const { KINDS, THEMES } = require('../../constants')
const { getActiveEvents } = require('../../../events/repos')
const {
  transformContactToOption,
  transformObjectToOption,
} = require('../../../transformers')
const { getOptions } = require('../../../../lib/options')

const { OPTION_YES, OPTION_NO } = require('../../../constants')

const transformServiceToOption = (service) => ({
  value: service.id,
  label: service.name,
  contexts: service.contexts,
  interaction_questions: service.interaction_questions,
})

const transformToTypeahead = (value) => {
  if (!value) {
    return value
  }
  return Array.isArray(value)
    ? value.map(transformObjectToOption)
    : transformObjectToOption(value)
}

const transformToID = (value) => {
  if (!value) {
    return value
  }
  return Array.isArray(value)
    ? value.map((optionFromArrayOfOptions) => optionFromArrayOfOptions.id)
    : value.id
}

const transformToYesNo = (value) => (value ? OPTION_YES : OPTION_NO)

const transformValues = (interaction, callback, fieldNames) => {
  const isServiceDelivery = interaction.kind === KINDS.SERVICE_DELIVERY
  const serviceDeliveryExclusiveFields = [
    'service_delivery_status',
    'grant_amount_offered',
    'is_event',
  ]
  const interactionExclusiveFields = ['communication_channel']

  return fieldNames
    .filter((fieldName) => fieldName in interaction)
    .filter((fieldName) =>
      isServiceDelivery
        ? !interactionExclusiveFields.includes(fieldName)
        : !serviceDeliveryExclusiveFields.includes(fieldName)
    )
    .reduce(
      (acc, fieldName) => ({
        ...acc,
        [fieldName]: callback(interaction[fieldName]),
      }),
      {}
    )
}

const transformServiceAnswers = (serviceAnswers) => {
  if (!serviceAnswers) {
    return serviceAnswers
  }
  return Object.keys(serviceAnswers).reduce(
    (acc, questionId) => ({
      ...acc,
      [`service_answers.${questionId}`]: Object.keys(
        serviceAnswers[questionId]
      )[0],
    }),
    {}
  )
}

const transformInteractionToValues = (interaction) => {
  if (!interaction) {
    return {}
  }

  const serviceId = get(interaction, 'service.id')
  const serviceName = get(interaction, 'service.name', '')
  const [parentServiceLabel, childServiceLabel] = serviceName.split(' : ')

  return {
    theme: interaction.theme || THEMES.OTHER,
    service: childServiceLabel ? parentServiceLabel : serviceId,
    service_2nd_level: childServiceLabel ? serviceId : undefined,
    ...pick(interaction, [
      'id',
      'kind',
      'subject',
      'notes',
      'grant_amount_offered',
      'net_company_receipt',
      'policy_feedback_notes',
    ]),
    ...transformValues(interaction, transformToYesNo, [
      'was_policy_feedback_provided',
      'were_countries_discussed',
      'is_event',
    ]),
    ...transformValues(interaction, transformToID, [
      'service_delivery_status',
      'policy_issue_types',
    ]),
    ...transformValues(interaction, transformToTypeahead, [
      'contacts',
      'event',
      'communication_channel',
      'policy_areas',
    ]),
    ...transformServiceAnswers(interaction.service_answers),
  }
}

const getInitialFormValues = (req, res) => {
  const { user } = req.session
  const { company, investment, interaction, referral } = res.locals
  const { theme, kind } = req.params
  const date = interaction ? moment(interaction.date) : moment()
  const investmentId = get(
    investment,
    'id',
    get(interaction, 'investment_project')
  )
  return {
    theme,
    kind,
    company: company.id,
    investment_project: investmentId,
    date: {
      day: date.format('DD'),
      month: date.format('MM'),
      year: date.format('YYYY'),
    },
    contacts:
      referral && referral.contact
        ? [transformObjectToOption(referral.contact)]
        : [],
    dit_participants: [
      transformObjectToOption(
        get(interaction, 'dit_participants[0].adviser') || user
      ),
    ],
    ...transformInteractionToValues(interaction),
  }
}

async function renderInteractionDetailsForm(req, res, next) {
  try {
    const { token } = req.session
    const { company, interaction, referral, investment, contact } = res.locals

    const [
      services,
      serviceDeliveryStatuses,
      policyAreas,
      policyIssueTypes,
      communicationChannels,
      countries,
      activeEvents,
    ] = await Promise.all([
      getOptions(token, 'service', {
        transformer: transformServiceToOption,
      }),
      getOptions(token, 'service-delivery-status', { sorted: false }),
      getOptions(token, 'policy-area'),
      getOptions(token, 'policy-issue-type'),
      getOptions(token, 'communication-channel'),
      getOptions(token, 'country'),
      getActiveEvents(token),
    ])

    res
      .breadcrumb(
        interaction
          ? `Edit interaction for ${company.name}`
          : `Add interaction for ${company.name}`
      )
      .render('interactions/apps/details-form/views/interaction-details-form', {
        props: {
          initialValues: getInitialFormValues(req, res),
          companyId: get(company, 'id'),
          investmentId: get(investment, 'id'),
          referralId: get(referral, 'id'),
          contactId: get(contact, 'id'),
          contacts: company.contacts.map(transformContactToOption),
          activeEvents: activeEvents.map(transformObjectToOption),
          services,
          serviceDeliveryStatuses,
          policyAreas,
          policyIssueTypes,
          communicationChannels,
          countries,
        },
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderInteractionDetailsForm,
}
