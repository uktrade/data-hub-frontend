import qs from 'qs'

import { getPageOffset } from '../../../../client/utils/pagination.js'
import { apiProxyAxios } from '../../../components/Task/utils'

import { SHOW_ALL_OPTION } from '../constants.js'

export const getExportPipelineList = ({
  limit = 10,
  page = 1,
  archived = false,
  status,
  export_potential,
}) => {
  const offset = getPageOffset({ limit, page })

  const payload = {
    limit,
    page,
    offset,
    archived,
  }

  if (status !== SHOW_ALL_OPTION.value) {
    payload.status = status
  }

  if (export_potential !== SHOW_ALL_OPTION.value) {
    payload.export_potential = export_potential
  }

  const queryParams = qs.stringify(payload, { indices: false })
  return apiProxyAxios.get(`/v4/export?${queryParams}`).then(({ data }) => data)
}
