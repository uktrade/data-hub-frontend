import axios from 'axios'
import { subDays, isAfter } from 'date-fns'

import urls from '../../../../lib/urls'
import { apiProxyAxios } from '../../../components/Task/utils'

export function checkIfPendingRequest(duns_number) {
  if (duns_number) {
    return axios
      .get(
        `/api-proxy/v4/dnb/company-change-request?duns_number=${duns_number}`
      )
      .then(({ data }) => checkIfRequestIsValid(data))
  }
  return false
}

const isDNBDateValid = (date) => {
  const todaysDate = new Date()
  const timeInterval = subDays(todaysDate, 20)
  return isAfter(date, timeInterval)
}

const checkIfRequestIsValid = ({ count, results }) => {
  if (count > 0) {
    const validRequests = results.filter(
      (result) =>
        ['pending', 'submitted'].includes(result.status) &&
        isDNBDateValid(result.created_on)
    )
    return validRequests.length > 0
  }
  return false
}

export function archiveSubmitCallback({ companyId, csrfToken, values }) {
  return axios({
    method: 'POST',
    url: `${urls.companies.archive(companyId)}?_csrf=${csrfToken}`,
    data: values,
  })
}

export const getGlobalUltimate = (globalUltimateDunsNumber) =>
  globalUltimateDunsNumber
    ? apiProxyAxios.post('/v4/search/company', {
        duns_number: globalUltimateDunsNumber,
      })
    : ''
