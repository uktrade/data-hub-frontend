import { omitBy, isEmpty } from 'lodash'

import { getQueryParamsFromLocation } from '../../../../client/utils/url'
import { parsePage } from '../../../../client/utils/pagination'

export const TASK_GET_EXPORT_PIPELINE_LIST = 'TASK_GET_EXPORT_PIPELINE_LIST'

export const ID = 'exportPipelineList'

import {
  SORT_OPTIONS,
  STATUS_LIST_OPTIONS,
  EXPORT_POTENTIAL_LIST_OPTIONS,
} from '../constants'

const areFiltersActive = (queryParams) => {
  const filters = omitBy(
    queryParams,
    (filterValue, filterName) =>
      filterValue === 'all-statuses' || filterName === 'page'
  )

  return !isEmpty(filters)
}

export const state2props = ({ router, ...state }) => {
  const queryParams = getQueryParamsFromLocation(router.location)
  return {
    ...state[ID],
    payload: {
      ...queryParams,
      page: parsePage(queryParams.page),
    },
    filters: {
      areActive: areFiltersActive(queryParams),
      status: {
        options: STATUS_LIST_OPTIONS,
      },
      exportPotential: {
        options: EXPORT_POTENTIAL_LIST_OPTIONS,
      },
      sortby: {
        options: SORT_OPTIONS,
      },
    },
  }
}
