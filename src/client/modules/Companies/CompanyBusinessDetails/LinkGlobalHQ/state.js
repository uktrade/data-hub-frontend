import { transformPostcodeToApi } from '../../CollectionList/transformers'
import { buildSelectedFilters } from './filters'
import { SORT_OPTIONS } from '../../CollectionList/constants'
import { locationToQSParamsWithPage } from '../../../../utils/url'

export const ID = 'linkGlobalHQ'
export const SET_GLOBAL_HQ_ID = 'setGlobalHQ'
export const REMOVE_GLOBAL_HQ_ID = 'removeGlobalHQ'

export const TASK_GET_GLOBAL_HQ_LIST = 'TASK_GET_GLOBAL_HQ_LIST'
export const TASK_SET_GLOBAL_HQ = 'TASK_SET_GLOBAL_HQ'
export const TASK_REMOVE_GLOBAL_HQ = 'TASK_REMOVE_GLOBAL_HQ'

export const state2props = ({ router, ...state }) => {
  const queryParams = locationToQSParamsWithPage(router.location)
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

export const setState2Props = (state) => state[SET_GLOBAL_HQ_ID]
