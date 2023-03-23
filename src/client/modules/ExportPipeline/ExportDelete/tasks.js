import { apiProxyAxios } from '../../../../client/components/Task/utils'

export const deleteExport = ({ exportId }) =>
  apiProxyAxios.delete(`/v4/export/${exportId}`)
