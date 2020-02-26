import axios from 'axios'
import { DateUtils } from 'data-hub-components'

const WHITELISTED_HISTORY_TYPES = ['insert', 'delete']

const COUNTRY_HISTORY_TYPE_TEXT = {
  insert: 'added to',
  delete: 'removed from',
}
const COUNTRY_TYPE_TEXT = {
  future_interest: 'future countries of interest',
  currently_exporting: 'currently exporting',
  not_interested: 'countries of no interest',
}

const getCountryText = (country, historyType, status) => {
  const historyTypeText = COUNTRY_HISTORY_TYPE_TEXT[historyType]
  const typeText = COUNTRY_TYPE_TEXT[status]

  return [country, historyTypeText, typeText].join(' ')
}

const createCountry = (item) => ({
  headingText: getCountryText(
    item.country.name,
    item.history_type,
    item.status
  ),
  metadata: [
    {
      label: 'By',
      value: item.history_user?.name ?? 'unknown',
    },
    { label: 'Date', value: DateUtils.formatWithTime(item.history_date) },
  ],
})

const transformFullExportHistory = ({ results }, offset) => {
  const cleanedResults = results.filter((result) =>
    WHITELISTED_HISTORY_TYPES.includes(result.history_type)
  )
  const count = cleanedResults.length + offset

  return {
    count,
    results: cleanedResults.slice(0, 10).map(createCountry),
  }
}

const handleError = (e) => Promise.reject(Error(e.response.data.detail))

export const fetchExportsHistory = ({ companyId, activePage }) => {
  const offset = activePage * 10 - 10
  return axios
    .post('/api-proxy/v4/search/export-country-history', {
      company: companyId,
      offset,
    })
    .catch(handleError)
    .then(({ data }) => transformFullExportHistory(data, offset))
}
