import { buildSelectedFilters } from './filters'
import {
  COMPANY_HAS_NAME,
  COMPANY_STATUS_OPTIONS,
  SORT_OPTIONS,
} from './constants'
import {
  transformArchivedToApi,
  transformHasNameToApi,
  transformPostcodeToApi,
} from './transformers'
import { parseQueryString } from '../../../utils'

export const TASK_GET_COMPANIES_LIST = 'TASK_GET_COMPANIES_LIST'
export const TASK_GET_COMPANIES_METADATA = 'TASK_GET_COMPANIES_METADATA'
export const TASK_GET_COMPANIES_LEAD_ITA_OR_GLOBAL_ACCOUNT_MANAGER_NAME =
  'TASK_GET_COMPANIES_LEAD_ITA_OR_GLOBAL_ACCOUNT_MANAGER_NAME'
export const TASK_GET_COMPANIES_ADVISER_NAME = 'TASK_GET_COMPANIES_ADVISER_NAME'
export const ID = 'companiesList'

/**
 * Convert both location and redux state to props
 */
export const state2props = ({ router, ...state }) => {
  const queryString = router.location.search.slice(1)
  const queryParams = parseQueryString(queryString)
  const archived = transformArchivedToApi(queryParams.archived)
  const ukPostcode = transformPostcodeToApi(queryParams.uk_postcode)
  const hasName = transformHasNameToApi(queryParams.has_name)

  const { metadata, selectedLeadItaOrGlobalAccountManagers, advisers } =
    state[ID]

  const selectedFilters = buildSelectedFilters(
    queryParams,
    metadata,
    selectedLeadItaOrGlobalAccountManagers,
    advisers
  )

  return {
    ...state[ID],
    payload: {
      ...queryParams,
      archived,
      uk_postcode: ukPostcode,
      has_name: hasName,
    },
    optionMetadata: {
      sortOptions: SORT_OPTIONS,
      companyStatusOptions: COMPANY_STATUS_OPTIONS,
      companyHasNameOptions: COMPANY_HAS_NAME,
      ...metadata,
    },
    selectedFilters,
  }
}
