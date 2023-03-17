import { apiProxyAxios } from '../../../../client/components/Task/utils'

export const saveExport = ({ exportId, values }) => {
  const request = exportId ? apiProxyAxios.patch : apiProxyAxios.post
  const endpoint = exportId ? `/v4/export/${exportId}` : '/v4/export'
  return request(endpoint, values)
}
