import { apiProxyAxios } from '../../../../client/components/Task/utils'
import { transformFormValuesForAPI } from './transformers'

export const saveStrategy = ({ strategy, companyId }) => {
  const request = apiProxyAxios.patch
  const endpoint = `/v4/company/${companyId}`
  return request(endpoint, { strategy: strategy })
}

export const saveObjective = ({ values, companyId, objectiveId }) => {
  values.company = companyId
  // values.id = objectiveId
  if (objectiveId) {
    const request = apiProxyAxios.patch
    const endpoint = `/v4/company/${companyId}/objective/${objectiveId}`
    return request(endpoint, transformFormValuesForAPI(values))
  } else {
    const request = apiProxyAxios.post
    const endpoint = `/v4/company/${companyId}/objective`
    return request(endpoint, transformFormValuesForAPI(values))
  }
}

export const getObjective = ({ companyId, objectiveId }) =>
  apiProxyAxios
    .get(`/v4/company/${companyId}/objective/${objectiveId}`)
    .then(({ data }) => data)
