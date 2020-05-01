import axios from 'axios'

import { INTERACTION_STATUS } from '../../../constants'
import { EXPORT_INTEREST_STATUS_VALUES, OPTION_NO } from '../../../../constants'
import { ID as STORE_ID } from './state'

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
  return values.service.interaction_questions.reduce(
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

export function createInteraction({ values, companyId, referral }) {
  window.sessionStorage.removeItem(STORE_ID)

  const endpoint = referral
    ? `/api-proxy/v4/company-referral/${referral.id}/complete`
    : '/api-proxy/v3/interaction'

  return axios.post(endpoint, {
    ...values,
    company: {
      id: companyId,
    },
    status: INTERACTION_STATUS.COMPLETE,
    service: transformOption(values.service),
    service_answers: transformServiceAnswers(values),
    contacts: transformArrayOfOptions(values.contacts),
    dit_participants: values.advisers.map((a) => ({
      adviser: a.value,
    })),
    date: `${values.date.year}-${values.date.month}-${values.date.day}`,
    policy_areas: transformArrayOfOptions(values.policy_areas),
    communication_channel: transformOption(values.communication_channel),
    event: transformOption(values.event),
    export_countries: transformExportCountries(values),
  })
}
