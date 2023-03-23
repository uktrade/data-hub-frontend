import { apiProxyAxios } from '../../../components/Task/utils'

export const getExportPipelineList = () =>
  apiProxyAxios.get('/v4/export').then(({ data }) => data)
