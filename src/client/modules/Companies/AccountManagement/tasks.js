import { apiProxyAxios } from '../../../../client/components/Task/utils'

export const saveStrategy = ({ strategy, companyId }) => {
  const request = apiProxyAxios.patch
  const endpoint = `/v4/company/${companyId}`
  return request(endpoint, { strategy: strategy })
}

export const saveObjective = ({ objective, companyId }) => {
  const request = apiProxyAxios.post
  const endpoint = `/v4/company/${companyId}/objective`
  return request(endpoint, { objective: objective })
}
