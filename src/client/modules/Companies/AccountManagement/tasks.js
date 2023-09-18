import { apiProxyAxios } from '../../../../client/components/Task/utils'
import { METHOD_POST } from '../../../../common/constants'
import { transformFormValuesForAPI } from './transformers'

export const saveStrategy = ({ strategy, companyId }) => {
  const request = apiProxyAxios.patch
  const endpoint = `/v4/company/${companyId}`
  return request(endpoint, { strategy: strategy })
}

export const saveObjective = ({ values, companyId, objective }) => {
  values.company = companyId
  let request, endpoint
  if (objective) {
    request = apiProxyAxios.patch
    endpoint = `/v4/company/${companyId}/objective/${objective.id}`
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

export const archiveObjective = ({ objective }) => {
  const endpoint = `/v4/company/objective/${objective.id}/archive`

  const data = { reason: 'completed' }

  const options = {
    data: data,
    url: endpoint,
    method: METHOD_POST,
  }
  return apiProxyAxios(options)
}
