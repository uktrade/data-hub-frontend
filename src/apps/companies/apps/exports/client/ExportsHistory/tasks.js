import axios from 'axios'
import { formatWithTime } from '../../../../../../client/utils/date-utils'
import { GREEN } from 'govuk-colours'

import urls from '../../../../../../lib/urls'
import groupExportCountries from '../../../../../../lib/group-export-countries'
import {
  EXPORT_INTEREST_STATUS,
  EXPORT_INTEREST_STATUS_VALUES,
} from '../../../../../constants'
import { groupHistoryItems } from '../group-history-items'

const WHITELISTED_HISTORY_TYPES = ['insert', 'delete', 'update']

const COUNTRY_HISTORY_TYPE_TEXT = {
  insert: 'added to',
  delete: 'removed from',
  update: 'moved to',
}

const COUNTRY_TYPE_TEXT = {
  future_interest: 'future countries of interest',
  currently_exporting: 'currently exporting',
  not_interested: 'countries of no interest',
}

const COUNTRY_TYPE_LABEL = {
  [EXPORT_INTEREST_STATUS.EXPORTING_TO]: 'Countries currently exporting to',
  [EXPORT_INTEREST_STATUS.FUTURE_INTEREST]: 'Future countries of interest',
  [EXPORT_INTEREST_STATUS.NOT_INTERESTED]: 'Countries not interested in',
}

function getCountryText(countries, historyType, status) {
  const historyTypeText = COUNTRY_HISTORY_TYPE_TEXT[historyType]
  const typeText = COUNTRY_TYPE_TEXT[status]
  const countryText = countries
    .map((country) => country.name)
    .sort()
    .join(', ')

  return [countryText, historyTypeText, typeText].join(' ')
}

function createHistory(item) {
  return {
    headingText: getCountryText(item.countries, item.history_type, item.status),
    metadata: [
      {
        label: 'By',
        value: item.history_user?.name ?? 'unknown',
      },
      { label: 'Date', value: formatWithTime(item.date) },
    ],
  }
}

const isInteraction = (item) => item.hasOwnProperty('kind')

function getAdvisersText(items) {
  return items
    .map((item) => `${item.adviser.name} (${item.team.name})`)
    .join(', ')
}

function createInteraction(item) {
  const countryBuckets = groupExportCountries(item.export_countries)
  const metadata = [
    {
      label: 'Company contact' + (item.contacts.length > 1 ? 's' : ''),
      value: item.contacts.map((contact) => contact.name).join(', '),
    },
    {
      label: 'Adviser' + (item.dit_participants.length > 1 ? 's' : ''),
      value: getAdvisersText(item.dit_participants),
    },
    {
      label: 'Service',
      value: item.service.name,
    },
  ]

  EXPORT_INTEREST_STATUS_VALUES.forEach((status) => {
    const countries = countryBuckets[status]
    if (countries?.length) {
      metadata.push({
        label: COUNTRY_TYPE_LABEL[status],
        value: countries.map((country) => country.name).join(', '),
      })
    }
  })

  return {
    headingText: item.subject,
    headingUrl: urls.interactions.detail(item.id),
    subheading: `Created ${formatWithTime(item.date)}`,
    badges: [
      {
        text: 'Interaction',
        borderColour: GREEN,
      },
    ],
    metadata,
  }
}

function transformFullExportHistory({ results }, activePage) {
  const offset = activePage * 10 - 10
  const cleanedResults = groupHistoryItems(
    results.filter(
      (item) =>
        isInteraction(item) ||
        WHITELISTED_HISTORY_TYPES.includes(item.history_type)
    )
  )

  return {
    count: cleanedResults.length,
    results: cleanedResults
      .slice(offset, offset + 10)
      .map((item) =>
        isInteraction(item) ? createInteraction(item) : createHistory(item)
      ),
  }
}

function handleError(e) {
  const message = e?.response?.data?.detail || 'An unknown error occured'
  return Promise.reject(new Error(message))
}

export function fetchExportsHistory({ companyId, countryId, activePage }) {
  return axios
    .post('/api-proxy/v4/search/export-country-history', {
      company: companyId,
      country: countryId,
    })
    .catch(handleError)
    .then(({ data }) => transformFullExportHistory(data, activePage))
}
