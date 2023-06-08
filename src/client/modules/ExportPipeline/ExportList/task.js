import { omitBy, isUndefined } from 'lodash'
import qs from 'qs'

import { getPageOffset } from '../../../../client/utils/pagination.js'
import { apiProxyAxios } from '../../../components/Task/utils'

import { getMetadataOptions } from '../../../metadata'
import { transformAPIAdvisersToOptions } from '../transformers'
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
  owner,
  sortby = 'created_on:desc',
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
      owner,
      sortby,
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
    apiProxyAxios.get('v4/export/owner'),
  ]).then(([sectorOptions, countryOptions, owners]) => ({
    sectorOptions: [SHOW_ALL_OPTION, ...sectorOptions],
    countryOptions: [SHOW_ALL_OPTION, ...countryOptions],
    ownerOptions: [SHOW_ALL_OPTION, ...transformAPIAdvisersToOptions(owners)],
  }))
