import axios from 'axios'
import { omit, pick, sortBy } from 'lodash'

import urls from '../../../../../lib/urls'
import { catchApiError } from '../../../../../client/components/Task/utils'
import getContactFromQuery from '../../../../../client/utils/getContactFromQuery'
import { INTERACTION_STATUS } from '../../../constants'
import { EXPORT_INTEREST_STATUS_VALUES, OPTION_NO } from '../../../../constants'
import { ID as STORE_ID } from './state'
import { transformValueForApi } from '../../../../../common/date'

const FIELDS_TO_OMIT = [
  'currently_exporting',
  'future_interest',
  'not_interested',
  'service_2nd_level',
]

function transformOption(option) {
  if (!option || !option.value) {
    return null
  }
  return option.value
}

const isDisabled = (item) =>
  !item.disabled_on || Date.parse(item.disabled_on) > Date.now()

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

const transformToValueLabel = ({ id, name }) => ({
  value: id,
  label: name,
})

const transformServiceToOption = (service) => ({
  value: service.id,
  label: service.name,
  contexts: service.contexts,
  interaction_questions: service.interaction_questions,
})

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

  if (!stateFromStorage) {
    return {}
  }

  const queryContact = getContactFromQuery()
  if (queryContact.label && queryContact.value) {
    const updatedState = JSON.parse(stateFromStorage)
    updatedState.values.contacts.push({
      label: queryContact.label,
      value: queryContact.value,
    })
    return updatedState
  }

  return JSON.parse(stateFromStorage)
}

export function saveInteraction({
  values,
  companyId,
  referralId,
  isTradeAgreementInteractionEnabled,
}) {
  window.sessionStorage.removeItem(STORE_ID)

  const interactionVersion = isTradeAgreementInteractionEnabled ? 'v4' : 'v3'

  const endpoint = referralId
    ? `/api-proxy/v4/company-referral/${referralId}/complete`
    : `/api-proxy/${interactionVersion}/interaction`

  const request = values.id ? axios.patch : axios.post

  const commonPayload = {
    status: INTERACTION_STATUS.COMPLETE,
    company: {
      id: companyId,
    },
    service: values.service_2nd_level || values.service,
    service_answers: transformServiceAnswers(values),
    contacts: transformArrayOfOptions(values.contacts),
    dit_participants: values.dit_participants.map((a) => ({
      adviser: a.value,
    })),
    date: transformValueForApi(values.date),
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

const fetchServiceDeliveryStatusMetaData = () =>
  axios
    .get('/api-proxy/v4/metadata/service-delivery-status')
    .catch(catchApiError)
    .then(({ data }) => ({
      serviceDeliveryStatuses: data.map(transformToValueLabel),
    }))

const fetchPolicyAreaMetaData = () =>
  axios
    .get('/api-proxy/v4/metadata/policy-area')
    .catch(catchApiError)
    .then(({ data }) => ({ policyAreas: data.map(transformToValueLabel) }))

const fetchPolicyIssueTypesMetaData = () =>
  axios
    .get('/api-proxy/v4/metadata/policy-issue-type')
    .catch(catchApiError)
    .then(({ data }) => ({ policyIssueTypes: data.map(transformToValueLabel) }))

const fetchCountriesMetaData = () =>
  axios
    .get('/api-proxy/v4/metadata/country')
    .catch(catchApiError)
    .then(({ data }) => ({ countries: data.map(transformToValueLabel) }))

const fetchCommunicationChannelsMetaData = () =>
  axios
    .get('/api-proxy/v4/metadata/communication-channel')
    .catch(catchApiError)
    .then(({ data }) => ({
      communicationChannels: data.map(transformToValueLabel),
    }))

const fetchServicesMetaData = () =>
  axios
    .get('/api-proxy/v4/metadata/service')
    .catch(catchApiError)
    .then(({ data }) => ({
      services: sortBy(
        data
          .filter(isDisabled)
          .map((service) => transformServiceToOption(service)),
        'label'
      ),
    }))

const fetchTradeAgreementMetaData = () =>
  axios
    .get('/api-proxy/v4/metadata/trade-agreement')
    .catch(catchApiError)
    .then(({ data }) => ({
      relatedTradeAgreements: data.map(transformToValueLabel),
    }))

//All this stuff should be sorted alphabetically aside from 'service-delivery-status'
export const fetchMetaData = () =>
  Promise.all([
    fetchServicesMetaData(),
    fetchServiceDeliveryStatusMetaData(),
    fetchTradeAgreementMetaData(),
    fetchPolicyAreaMetaData(),
    fetchPolicyIssueTypesMetaData(),
    fetchCommunicationChannelsMetaData(),
    fetchCountriesMetaData(),
  ]).then((data) =>
    data.reduce(
      (acc, cur) => ({
        ...acc,
        ...cur,
      }),
      {}
    )
  )
