import { apiProxyAxios } from '../../../components/Task/utils'

export const deleteFile = (id) => {
  apiProxyAxios.delete(`v4/document/${id}`)
}
