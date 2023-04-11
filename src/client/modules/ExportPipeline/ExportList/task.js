import qs from 'qs'

import { getPageOffset } from '../../../../client/utils/pagination.js'
import { apiProxyAxios } from '../../../components/Task/utils'

export const getExportPipelineList = ({ limit = 10, page = 1 }) => {
  const offset = getPageOffset({ limit, page })
  const queryParams = qs.stringify({
    limit,
    page,
    offset,
  })
  return apiProxyAxios.get(`/v4/export?${queryParams}`).then(({ data }) => data)
}
