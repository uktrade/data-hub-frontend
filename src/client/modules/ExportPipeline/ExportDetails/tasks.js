import { apiProxyAxios } from '../../../components/Task/utils'
import { transformExportPipelineDetails } from './transformers'

export const getExportDetails = (exportId) =>
  apiProxyAxios
    .get(`/v4/export/${exportId}`)
    .then(({ data }) => transformExportPipelineDetails(data))
