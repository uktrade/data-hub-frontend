import { apiProxyAxios } from '../../../../client/components/Task/utils'
import { transformFormValuesForAPI } from '../transformers'
import { ID } from './state'

export const saveExport = ({ exportId, values }) => {
  window.sessionStorage.removeItem(ID)
  const request = exportId ? apiProxyAxios.patch : apiProxyAxios.post
  const endpoint = exportId ? `/v4/export/${exportId}` : '/v4/export'
  return request(endpoint, transformFormValuesForAPI(values))
}
