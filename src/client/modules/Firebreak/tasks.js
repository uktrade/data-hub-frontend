import { apiProxyAxios } from '../../components/Task/utils'

export const saveFirebreak = ({ values }) => {
  const request = apiProxyAxios.post
  const endpoint = '/v4/export'
  return request(endpoint, values)
}
