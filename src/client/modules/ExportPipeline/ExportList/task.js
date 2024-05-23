import { omitBy, isUndefined } from 'lodash'
import qs from 'qs'

import { getPageOffset } from '../../../../client/utils/pagination.js'
import { apiProxyAxios } from '../../../components/Task/utils'
import { SHOW_ALL_OPTION } from '../constants.js'

export const getExportPipelineList = ({
  limit = 10,
  page = 1,
  archived = false,
  sortby = 'created_on:desc',
  status,
  export_potential,
  sector,
  destination_country,
  estimated_win_date_after, // from
  estimated_win_date_before, // to
  owner,
}) => {
  const offset = getPageOffset({ limit, page })
  const payload = omitBy(
    {
      limit,
      page,
      offset,
      archived,
      sortby,
      status,
      export_potential,
      sector,
      destination_country,
      owner,
    },
    (fieldValue) =>
      fieldValue === SHOW_ALL_OPTION.value || isUndefined(fieldValue)
  )

  if (estimated_win_date_after) {
    payload.estimated_win_date_after = `${estimated_win_date_after}-01`
  }

  if (estimated_win_date_before) {
    payload.estimated_win_date_before = `${estimated_win_date_before}-01`
  }

  const queryParams = qs.stringify(payload, { indices: false })
  return apiProxyAxios.get(`/v4/export?${queryParams}`).then(({ data }) => data)
}
