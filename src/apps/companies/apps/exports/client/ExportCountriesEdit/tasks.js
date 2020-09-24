import axios from 'axios'

import { API_ERROR, API_WARN, SAVED } from './state'
import urls from '../../../../../../lib/urls'
import getExportCountries from '../../../../../../lib/get-export-countries'

function transformFieldValues(fields) {
  const countryFields = {}
  for (const [name, values] of Object.entries(fields)) {
    countryFields[name] = values?.map(({ value }) => value)
  }
  return countryFields
}

export function saveExportCountries({ values, companyId }) {
  return axios
    .patch(`/api-proxy/v4/company/${companyId}/export-detail`, {
      export_countries: getExportCountries(transformFieldValues(values)) || [],
    })
    .catch((e) => {
      const is400 = e?.response?.status === 400
      const nonFieldMessages = is400 && e.response.data?.non_field_errors
      if (nonFieldMessages?.length) {
        return Promise.reject({ [API_ERROR]: nonFieldMessages.join(', ') })
      } else {
        return Promise.reject({ [API_WARN]: e.message })
      }
    })
    .then(() => ({ [SAVED]: urls.companies.exports.index(companyId) }))
}
