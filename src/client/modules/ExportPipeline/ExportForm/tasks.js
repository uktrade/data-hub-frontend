import { apiProxyAxios } from '../../../../client/components/Task/utils'

export const saveExport = (values) => {
  const request = values.id ? apiProxyAxios.patch : apiProxyAxios.post
  const endpoint = values.id ? `/v4/export/${values.id}` : '/v4/export'
  return request(endpoint, values)
}
