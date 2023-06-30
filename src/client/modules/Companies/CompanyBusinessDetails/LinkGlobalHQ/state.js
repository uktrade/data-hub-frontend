import { omitBy, isEmpty } from 'lodash'
import qs from 'qs'

import { transformPostcodeToApi } from '../../CollectionList/transformers'
import { buildSelectedFilters } from './filters'
import { SORT_OPTIONS } from '../../CollectionList/constants'

export const ID = 'linkGlobalHQ'

export const TASK_GET_GLOBAL_HQ_LIST = 'TASK_GET_GLOBAL_HQ_LIST'

const parseQueryString = (queryString) => {
  const queryParams = omitBy({ ...qs.parse(queryString) }, isEmpty)
  return {
    ...queryParams,
    page: parseInt(queryParams.page || 1, 10),
  }
}

export const state2props = ({ router, ...state }) => {
  const queryString = router.location.search.slice(1)
  const queryParams = parseQueryString(queryString)
  const ukPostcode = transformPostcodeToApi(queryParams.uk_postcode)

  const { metadata } = state[ID]

  const selectedFilters = buildSelectedFilters(queryParams, metadata)

  return {
    ...state[ID],
    payload: {
      ...queryParams,
      uk_postcode: ukPostcode,
    },
    optionMetadata: {
      sortOptions: SORT_OPTIONS,
      ...metadata,
    },
    selectedFilters,
  }
}
