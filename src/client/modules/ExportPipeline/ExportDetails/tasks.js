import { apiProxyAxios } from '../../../components/Task/utils'

export const getExportDetails = (exportId) =>
  exportId
    ? apiProxyAxios.get(`/v4/export/${exportId}`).then(({ data }) => data)
    : Promise.resolve({})
