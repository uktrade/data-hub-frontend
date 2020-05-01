import axios from 'axios'
import { omit, pick } from 'lodash'

import { INTERACTION_STATUS } from '../../../constants'
import { EXPORT_INTEREST_STATUS_VALUES, OPTION_NO } from '../../../../constants'
import { ID as STORE_ID } from './state'

const FIELDS_TO_OMIT = [
  'currently_exporting',
  'future_interest',
  'not_interested',
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
  return values.service?.interaction_questions?.reduce(
    (acc, question) => ({
      ...acc,
      [question.id]: {
        [values[`service_answers[${question.id}]`]]: {},
      },
    }),
    {}
  )
}

export function openContactForm({ values, currentStep, url }) {
  window.sessionStorage.setItem(
    STORE_ID,
    JSON.stringify({
      values,
      currentStep,
    })
  )
  window.location.href = url
}

export function restoreState() {
  const stateFromStorage = window.sessionStorage.getItem(STORE_ID)
  return stateFromStorage ? JSON.parse(stateFromStorage) : {}
}

export function saveInteraction({ values, companyId, referralId }) {
  window.sessionStorage.removeItem(STORE_ID)

  const endpoint = referralId
    ? `/api-proxy/v4/company-referral/${referralId}/complete`
    : '/api-proxy/v3/interaction'

  const request = values.id ? axios.patch : axios.post

  const commonPayload = {
    status: INTERACTION_STATUS.COMPLETE,
    company: {
      id: companyId,
    },
    service: transformOption(values.service),
    service_answers: transformServiceAnswers(values),
    contacts: transformArrayOfOptions(values.contacts),
    dit_participants: values.dit_participants.map((a) => ({
      adviser: a.value,
    })),
    date: `${values.date.year}-${values.date.month}-${values.date.day}`,
    policy_areas: transformArrayOfOptions(values.policy_areas),
    communication_channel: transformOption(values.communication_channel),
    event: transformOption(values.event),
    ...pick(values, [
      'notes',
      'subject',
      'grant_amount_offered',
      'net_company_receipt',
      'policy_feedback_notes',
      'was_policy_feedback_provided',
      'is_event',
      'service_delivery_status',
      'policy_issue_types',
    ]),
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
  )
}
