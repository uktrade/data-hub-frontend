import { transformPostcodeToApi } from '../../../Companies/CollectionList/transformers'
import { buildSelectedFilters } from './filters'
import { SORT_OPTIONS } from '../../../Companies/CollectionList/constants'
import { locationToQSParamsWithPage } from '../../../../utils/url'

export const ID = 'selectOmisCompany'

export const TASK_GET_COMPANIES = 'TASK_GET_COMPANIES'

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
