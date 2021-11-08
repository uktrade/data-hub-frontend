import axios from 'axios'
import { get, omit, pick } from 'lodash'

import urls from '../../../../../lib/urls'
import {
  apiProxyAxios,
  catchApiError,
} from '../../../../../client/components/Task/utils'
import getContactFromQuery from '../../../../../client/utils/getContactFromQuery'
import { INTERACTION_STATUS, KINDS, THEMES } from '../../../constants'
import {
  EXPORT_INTEREST_STATUS_VALUES,
  OPTION_NO,
  OPTION_YES,
} from '../../../../constants'
import { ID as STORE_ID } from './state'

import { transformObjectToOption } from '../../../../transformers'

import { formatWithoutParsing } from '../../../../../client/utils/date'

const { transformValueForAPI } = require('../../../../../client/utils/date')

const FIELDS_TO_OMIT = [
  'currently_exporting',
  'future_interest',
  'not_interested',
  'service_2nd_level',
  'has_related_opportunity',
]

function transformOption(option) {
  if (!option || !option.value) {
    return null
  }
  return option.value
}

function transformArrayOfOptions(options) {
  if (!options || !options.length) {
    return []
  }
  return options.map(transformOption)
}

function transformExportCountries(values) {
  if (values.were_countries_discussed === OPTION_NO) {
    return
  }
  return EXPORT_INTEREST_STATUS_VALUES.filter(
    (status) => values[status]
  ).reduce(
    (acc, status) => [
      ...acc,
      ...values[status].map((country) => ({
        country: transformOption(country),
        status,
      })),
    ],
    []
  )
}

function transformServiceAnswers(values) {
  return Object.keys(values)
    .filter((fieldName) => fieldName.startsWith('service_answers.'))
    .reduce((acc, fieldName) => {
      const [, questionId] = fieldName.split('.')
      return {
        ...acc,
        [questionId]: {
          [values[`service_answers.${questionId}`]]: {},
        },
      }
    }, {})
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

const transformToID = (value) => {
  if (!value) {
    return value
  }
  return Array.isArray(value)
    ? value.map((optionFromArrayOfOptions) => optionFromArrayOfOptions.id)
    : value.id
}

const transformToTypeahead = (value) => {
  if (!value) {
    return value
  }
  return Array.isArray(value)
    ? value.map(transformObjectToOption)
    : transformObjectToOption(value)
}

const transformInteractionToValues = (interaction, companyId, investmentId) => {
  const advisers = interaction.dit_participants
    .filter((participant) => participant.adviser.name)
    .map((participant) => participant.adviser)
  const serviceId = get(interaction, 'service.id')
  const serviceName = get(interaction, 'service.name', '')
  const [parentServiceLabel, childServiceLabel] = serviceName.split(' : ')
  const date = new Date(interaction.date)

  return {
    theme: interaction.theme || THEMES.OTHER,
    service: childServiceLabel ? parentServiceLabel : serviceId,
    service_2nd_level: childServiceLabel ? serviceId : undefined,
    has_related_opportunity: transformToYesNo(
      interaction.large_capital_opportunity
    ),
    dit_participants: advisers.map((adviser) =>
      transformObjectToOption(adviser)
    ),
    date: {
      day: formatWithoutParsing(date, 'dd'),
      month: formatWithoutParsing(date, 'MM'),
      year: formatWithoutParsing(date, 'yyyy'),
    },
    companies: [companyId],
    investment_project: investmentId,
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
      'has_related_trade_agreements',
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
      'related_trade_agreements',
      'large_capital_opportunity',
    ]),
    ...transformServiceAnswers(interaction.service_answers),
  }
}

export function openContactForm({ values, url }) {
  window.sessionStorage.setItem(STORE_ID, JSON.stringify(values))
  window.location.href = url
}

export async function getInitialFormValues({
  companyId,
  referral,
  investmentId,
  user,
  interactionId,
}) {
  const queryContact = getContactFromQuery()

  // If user has added a contact during an interaction,
  // form values are stored in sessionStorage and added
  // back to state when returning to the form.
  if (queryContact.label && queryContact.value) {
    const valuesFromStorage = JSON.parse(
      window.sessionStorage.getItem(STORE_ID)
    )
    valuesFromStorage.contacts.push({
      label: queryContact.label,
      value: queryContact.value,
    })
    return valuesFromStorage
  } else if (interactionId) {
    // If editing an interaction
    return apiProxyAxios
      .get(`v4/interaction/${interactionId}`)
      .then(({ data }) =>
        transformInteractionToValues(data, companyId, investmentId)
      )
  } else {
    // If creating an interaction
    const date = new Date()
    const getInvestmentValues = (investmentId) =>
      investmentId && {
        kind: KINDS.INTERACTION,
        theme: THEMES.INVESTMENT,
      }
    return {
      companies: [companyId],
      investment_project: investmentId,
      date: {
        day: formatWithoutParsing(date, 'dd'),
        month: formatWithoutParsing(date, 'MM'),
        year: formatWithoutParsing(date, 'yyyy'),
      },
      contacts:
        referral && referral.contact
          ? [transformObjectToOption(referral.contact)]
          : [],
      dit_participants: [transformObjectToOption(user)],
      ...getInvestmentValues(investmentId),
    }
  }
}

export function saveInteraction({ values, companyIds, referralId }) {
  window.sessionStorage.removeItem(STORE_ID)

  const endpoint = referralId
    ? `/api-proxy/v4/company-referral/${referralId}/complete`
    : `/api-proxy/v4/interaction`

  const request = values.id ? axios.patch : axios.post

  const commonPayload = {
    status: INTERACTION_STATUS.COMPLETE,
    companies: companyIds,
    service: values.service_2nd_level || values.service,
    service_answers: transformServiceAnswers(values),
    contacts: transformArrayOfOptions(values.contacts),
    dit_participants: values.dit_participants.map((a) => ({
      adviser: a.value,
    })),
    date: transformValueForAPI(values.date),
    policy_areas: transformArrayOfOptions(values.policy_areas),
    communication_channel: transformOption(values.communication_channel),
    event: transformOption(values.event),
    // Cannot be empty string
    grant_amount_offered:
      'grant_amount_offered' in values
        ? values.grant_amount_offered || null
        : undefined,
    ...pick(values, [
      'notes',
      'subject',
      'net_company_receipt',
      'policy_feedback_notes',
      'was_policy_feedback_provided',
      'is_event',
      'service_delivery_status',
      'policy_issue_types',
      'has_related_trade_agreements',
    ]),
    related_trade_agreements: transformArrayOfOptions(
      values.related_trade_agreements
    ),
    ...(values.theme == THEMES.INVESTMENT && {
      large_capital_opportunity:
        values.has_related_opportunity == 'yes'
          ? values.large_capital_opportunity.value
          : null,
    }),
  }

  const payload = values.id
    ? {
        ...commonPayload,
      }
    : {
        ...values,
        ...commonPayload,
        export_countries: transformExportCountries(values),
      }
  return request(
    values.id ? `${endpoint}/${values.id}` : endpoint,
    omit(payload, FIELDS_TO_OMIT)
  ).catch(catchApiError)
}

export const fetchActiveEvents = () =>
  axios
    .get(urls.interactions.activeEventsData())
    .catch(catchApiError)
    .then(({ data }) => data)
