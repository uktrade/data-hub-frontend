import { transformPostcodeToApi } from '../../CollectionList/transformers'
import { buildSelectedFilters } from './filters'
import { SORT_OPTIONS } from '../../CollectionList/constants'
import { locationToQSParamsWithPage } from '../../../../utils/url'

export const ID = 'linkSubsidiary'

export const TASK_GET_SUBSIDIARY_LIST = 'TASK_GET_SUBSIDIARY_LIST'

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
