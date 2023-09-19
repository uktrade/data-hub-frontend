import { parseQueryString } from '../../../../../utils'
import { transformPostcodeToApi } from '../../../../Companies/CollectionList/transformers'
import {
  COMPANY_STATUS_OPTIONS,
  SORT_OPTIONS,
} from '../../../../Companies/CollectionList/constants'
import { buildSelectedFilters } from './filters'

export const RECIPIENT_COMPANY_ID = 'RECIPIENT_COMPANY_ID'
export const TASK_GET_UK_COMPANIES = 'TASK_GET_UK_COMPANIES'
export const TASK_UPDATE_RECIPIENT_COMPANY = 'TASK_UPDATE_RECIPIENT_COMPANY'
export const RECIPIENT_COMPANY_LIST_ID = 'recipientCompanyList'

export const state2props = ({ router, ...state }) => {
  const queryString = router.location.search.slice(1)
  const queryParams = parseQueryString(queryString)
  const ukPostcode = transformPostcodeToApi(queryParams.uk_postcode)

  const { metadata } = state[RECIPIENT_COMPANY_LIST_ID]

  const selectedFilters = buildSelectedFilters(queryParams, metadata)

  return {
    ...state[RECIPIENT_COMPANY_LIST_ID],
    payload: {
      ...queryParams,
      uk_postcode: ukPostcode,
    },
    optionMetadata: {
      sortOptions: SORT_OPTIONS,
      companyStatusOptions: COMPANY_STATUS_OPTIONS,
      ...metadata,
    },
    selectedFilters,
  }
}
