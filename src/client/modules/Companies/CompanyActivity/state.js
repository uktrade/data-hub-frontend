import { buildSelectedFilters } from './filters'
import { parseQueryString } from '../../../utils'
import { SORT_OPTIONS } from './constants'

export const TASK_GET_COMPANY_ACTIVITIES_NO_AS =
  'TASK_GET_COMPANY_ACTIVITIES_NO_AS'
export const TASK_GET_COMPANY_ACTIVITIES_METADATA =
  'TASK_GET_COMPANY_ACTIVITIES_METADATA'
export const TASK_GET_COMPANY_ACTIVITIES_ADVISER_NAME =
  'TASK_GET_COMPANY_ACTIVITIES_ADVISER_NAME'
export const TASK_GET_COMPANY_ACTIVITIES_COMPANY_NAME =
  'TASK_GET_COMPANY_ACTIVITIES_COMPANY_NAME'
export const TASK_GET_COMPANY_ACTIVITIES_TEAM_NAME =
  'TASK_GET_COMPANY_ACTIVITIES_TEAM_NAME'

export const ID = 'companyActivitiesListNoAS'

export const state2props = ({ router, ...state }) => {
  const queryString = router.location.search.slice(1)
  const queryParams = parseQueryString(queryString)
  const { currentAdviserId } = state
  const { metadata, selectedAdvisers, createdByOthers } = state[ID]

  const selectedFilters = buildSelectedFilters(
    queryParams,
    selectedAdvisers,
    currentAdviserId
  )

  queryParams.include_parent_companies =
    selectedFilters.includeRelatedCompanies.options.some(
      (f) => f.value === 'include_parent_companies'
    )
  queryParams.include_subsidiary_companies =
    selectedFilters.includeRelatedCompanies.options.some(
      (f) => f.value === 'include_subsidiary_companies'
    )

  return {
    ...state[ID],
    payload: {
      ...queryParams,
    },
    optionMetadata: {
      sortOptions: SORT_OPTIONS,
      ...metadata,
    },
    selectedFilters,
    currentAdviserId,
    createdByOthers,
  }
}
