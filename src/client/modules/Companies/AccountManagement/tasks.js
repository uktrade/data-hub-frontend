import { apiProxyAxios } from '../../../../client/components/Task/utils'
import { transformFormValuesForAPI } from './transformers'

export const saveStrategy = ({ strategy, companyId }) => {
  const request = apiProxyAxios.patch
  const endpoint = `/v4/company/${companyId}`
  return request(endpoint, { strategy: strategy })
}

export const saveObjective = ({ values, companyId, objectiveId }) => {
  values.company = companyId
  let request, endpoint
  if (objectiveId) {
    request = apiProxyAxios.patch
    endpoint = `/v4/company/${companyId}/objective/${objectiveId}`
  } else {
    request = apiProxyAxios.post
    endpoint = `/v4/company/${companyId}/objective`
  }
  return request(endpoint, transformFormValuesForAPI(values))
}

export const getObjective = ({ companyId, objectiveId }) =>
  apiProxyAxios
    .get(`/v4/company/${companyId}/objective/${objectiveId}`)
    .then(({ data }) => data)
