import { get, omit, pick } from 'lodash'
import axios from 'axios'

import urls from '../../../../../lib/urls'
import {
  apiProxyAxios,
  catchApiError,
} from '../../../../../client/components/Task/utils'
import getContactFromQuery from '../../../../../client/utils/getContactFromQuery'
import { INTERACTION_STATUS, KINDS, THEMES } from '../../../constants'
import {
  readThemeAndKindFromLocalStorage,
  writeThemeAndKindToLocalStorage,
} from './utils'
import {
  EXPORT_INTEREST_STATUS_VALUES,
  OPTION_NO,
  OPTION_YES,
} from '../../../../../common/constants'
import { ID as STORE_ID } from './state'

import {
  transformObjectToOption,
  transformOptionToValue,
  transformArrayOfOptionsToValues,
  transformToYesNo,
  transformToID,
  transformObjectToTypeahead,
  transformExportCountriesToGroupStatus,
} from '../../../../transformers'

import {
  formatDate,
  DATE_FORMAT_DAY,
  DATE_FORMAT_MONTH,
  DATE_FORMAT_YEAR,
} from '../../../../../client/utils/date-utils'

const { formatDateWithYearMonth } = require('../../../../../client/utils/date')

const FIELDS_TO_OMIT = [
  'currently_exporting',
  'future_interest',
  'not_interested',
  'service_2nd_level',
  'has_related_opportunity',
]

const HTTP_201_CREATED = 201

const isWereCountriesDiscussed = (wereCountriesDiscussed) =>
  wereCountriesDiscussed === OPTION_YES || wereCountriesDiscussed === true

function transformExportCountries(values) {
  return EXPORT_INTEREST_STATUS_VALUES.filter(
    (status) => values[status]
  ).reduce(
    (acc, status) => [
      ...acc,
      ...values[status].map((country) => ({
        country: transformOptionToValue(country),
        status,
      })),
    ],
    []
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

function transformServiceAnswersForPayload(values) {
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

const transformInteractionToValues = (interaction, companyId, investmentId) => {
  const advisers = interaction.dit_participants
    .filter((participant) => participant.adviser.name)
    .map((participant) => participant.adviser)
  const serviceId = get(interaction, 'service.id')
  const serviceName = get(interaction, 'service.name', '')
  const [parentServiceLabel, childServiceLabel] = serviceName.split(' : ')
  const date = new Date(interaction.date)

  const exportCountries = get(interaction, 'export_countries') || []
  const groupExportCountries =
    transformExportCountriesToGroupStatus(exportCountries)

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
      day: formatDate(date, DATE_FORMAT_DAY),
      month: formatDate(date, DATE_FORMAT_MONTH),
      year: formatDate(date, DATE_FORMAT_YEAR),
    },
    companies: [companyId],
    investment_project: investmentId,
    helped_remove_export_barrier: interaction.helped_remove_export_barrier
      ? OPTION_YES
      : OPTION_NO,
    ...pick(interaction, [
      'id',
      'kind',
      'subject',
      'notes',
      'grant_amount_offered',
      'net_company_receipt',
      'policy_feedback_notes',
      'export_barrier_notes',
    ]),
    ...transformValues(interaction, transformToYesNo, [
      'was_policy_feedback_provided',
      'were_countries_discussed',
      'is_event',
      'has_related_trade_agreements',
    ]),
    ...transformValues(interaction, transformToID, [
      'service_delivery_status',
      'export_barrier_types',
      'policy_issue_types',
    ]),
    ...transformValues(interaction, transformObjectToTypeahead, [
      'contacts',
      'event',
      'communication_channel',
      'policy_areas',
      'related_trade_agreements',
      'large_capital_opportunity',
    ]),
    ...transformServiceAnswers(interaction.service_answers),
    ...transformValues(groupExportCountries, transformObjectToTypeahead, [
      'currently_exporting',
      'future_interest',
      'not_interested',
    ]),
  }
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

    /**
     * NOTE:
     * The transformed interaction values above currently cascaded
     * as props(values) in the FORM, from InteractionDetailsForm down to
     * StepInteractionDetails
     **/
  } else {
    // If creating an interaction
    const date = new Date()

    // If the user is coming from the investment page
    // they don't get to choose the theme or kind.
    const getThemeAndKindForInvestment = () => ({
      theme: THEMES.INVESTMENT,
      kind: KINDS.INTERACTION,
    })

    return {
      companies: [companyId],
      investment_project: investmentId,
      date: {
        day: formatDate(date, DATE_FORMAT_DAY),
        month: formatDate(date, DATE_FORMAT_MONTH),
        year: formatDate(date, DATE_FORMAT_YEAR),
      },
      contacts:
        referral && referral.contact
          ? [transformObjectToOption(referral.contact)]
          : [],
      dit_participants: [transformObjectToOption(user)],
      ...(investmentId
        ? getThemeAndKindForInvestment()
        : readThemeAndKindFromLocalStorage()),
    }
  }
}

export function saveInteraction({ values, companyIds, referralId }) {
  window.sessionStorage.removeItem(STORE_ID)

  const endpoint = referralId
    ? `/v4/company-referral/${referralId}/complete`
    : `/v4/interaction`

  const request = values.id ? apiProxyAxios.patch : apiProxyAxios.post

  const commonPayload = {
    status: INTERACTION_STATUS.COMPLETE,
    companies: companyIds,
    service: values.service_2nd_level || values.service,
    service_answers: transformServiceAnswersForPayload(values),
    contacts: transformArrayOfOptionsToValues(values.contacts),
    dit_participants: values.dit_participants.map((a) => ({
      adviser: a.value,
    })),
    date: formatDateWithYearMonth(values.date),
    policy_areas: transformArrayOfOptionsToValues(values.policy_areas),
    communication_channel: transformOptionToValue(values.communication_channel),
    event: transformOptionToValue(values.event),
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
    helped_remove_export_barrier:
      values.helped_remove_export_barrier === OPTION_YES,
    export_barrier_types: values.export_barrier_types || [],
    export_barrier_notes: values.export_barrier_notes || '',

    related_trade_agreements: transformArrayOfOptionsToValues(
      values.related_trade_agreements
    ),
    ...(values.theme == THEMES.INVESTMENT && {
      large_capital_opportunity:
        values.has_related_opportunity == 'yes'
          ? values.large_capital_opportunity.value
          : null,
    }),
    // If the user has selected Investment the
    // API endpoint still requires a kind.
    ...(values.theme == THEMES.INVESTMENT && {
      kind: KINDS.INTERACTION,
    }),
    // If the user has selected Trade agreement
    // the API endpoint still requires a kind.
    ...(values.theme == THEMES.TRADE_AGREEMENT && {
      kind: KINDS.INTERACTION,
    }),

    // Added to ensure were_countries_discussed has a valid value
    were_countries_discussed: transformToYesNo(
      isWereCountriesDiscussed(values.were_countries_discussed)
    ),

    // Added to ensure export_countries has a valid value
    export_countries: isWereCountriesDiscussed(values.were_countries_discussed)
      ? transformExportCountries(values)
      : [],
  }

  const payload = values.id
    ? {
        ...commonPayload,
      }
    : {
        ...values,
        ...commonPayload,
      }

  return request(
    values.id ? `${endpoint}/${values.id}` : endpoint,
    omit(payload, FIELDS_TO_OMIT)
  )
    .then((result) => {
      if (result.status === HTTP_201_CREATED) {
        // Save both the theme and kind so when the user
        // creates their next interaction both fields will
        // prepopulate based on their previous selections.
        // Statistics show us that users select the same
        // options 85% of the time.
        writeThemeAndKindToLocalStorage(values.theme, values.kind)
      }
      return result
    })
    .catch((e) => {
      // Accounts for non-standard API error on contacts field
      const contactsError = e.response?.data?.contacts[0]
      return contactsError
        ? Promise.reject(contactsError)
        : catchApiError(e).message
    })
}

export const fetchActiveEvents = () =>
  axios
    .get(urls.interactions.activeEventsData())
    .catch(catchApiError)
    .then(({ data }) => data)
