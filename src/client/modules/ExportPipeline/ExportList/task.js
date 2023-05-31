import { omitBy, isUndefined } from 'lodash'
import qs from 'qs'

import { getPageOffset } from '../../../../client/utils/pagination.js'
import { apiProxyAxios } from '../../../components/Task/utils'

import { getMetadataOptions } from '../../../metadata'
import { SHOW_ALL_OPTION } from '../constants.js'
import urls from '../../../../lib/urls'

export const getExportPipelineList = ({
  limit = 10,
  page = 1,
  archived = false,
  status,
  export_potential,
  sector,
  destination_country,
  estimated_win_date_after, // from
  estimated_win_date_before, // to
}) => {
  const offset = getPageOffset({ limit, page })
  const payload = omitBy(
    {
      limit,
      page,
      offset,
      archived,
      status,
      export_potential,
      sector,
      destination_country,
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

export const getExportPipelineMetadata = () =>
  Promise.all([
    getMetadataOptions(urls.metadata.sector(), {
      params: {
        level__lte: '2',
      },
    }),
    getMetadataOptions(urls.metadata.country()),
  ]).then(([sectorOptions, countryOptions]) => ({
    sectorOptions: [SHOW_ALL_OPTION, ...sectorOptions],
    countryOptions: [SHOW_ALL_OPTION, ...countryOptions],
  }))
