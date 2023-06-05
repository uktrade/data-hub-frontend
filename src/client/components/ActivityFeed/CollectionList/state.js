import { omitBy, isEmpty } from 'lodash'
import qs from 'qs'

export const TASK_GET_COMPANY_ACTIVITIES_LIST =
  'TASK_GET_COMPANY_ACTIVITIES_LIST'
export const TASK_GET_COMPANY_ACTIVITIES_METADATA =
  'TASK_GET_COMPANY_ACTIVITIES_METADATA'

export const TASK_GET_COMPANY_ACTIVITIES_ADVISER_NAME =
  'TASK_GET_COMPANY_ACTIVITIES_ADVISER_NAME'
export const TASK_GET_COMPANY_ACTIVITIES_COMPANY_NAME =
  'TASK_GET_COMPANY_ACTIVITIES_COMPANY_NAME'
export const TASK_GET_COMPANY_ACTIVITIES_TEAM_NAME =
  'TASK_GET_COMPANY_ACTIVITIES_TEAM_NAME'

export const TASK_GET_INTERACTIONS_LIST = 'TASK_GET_INTERACTIONS_LIST'
export const TASK_GET_INTERACTIONS_ADVISER_NAME =
  'TASK_GET_INTERACTIONS_ADVISER_NAME'
export const TASK_GET_INTERACTIONS_METADATA = 'TASK_GET_INTERACTIONS_METADATA'
export const TASK_GET_INTERACTIONS_TEAM_NAME = 'TASK_GET_INTERACTIONS_TEAM_NAME'
export const TASK_GET_INTERACTIONS_COMPANY_NAME =
  'TASK_GET_INTERACTIONS_COMPANY_NAME'

export const ID = 'companyActivitiesList'

import { buildSelectedFilters } from './filters'
import { SORT_OPTIONS } from './constants'
import { transformWasPolicyfeedBackProvidedToApi } from './transformers'

const parseQueryString = (queryString) => {
  const queryProps = omitBy({ ...qs.parse(queryString) }, isEmpty)
  return {
    ...queryProps,
    page: parseInt(queryProps.page || 1, 10),
  }
}

export const state2props = ({ router, ...state }) => {
  const queryString = router.location.search.slice(1)
  const queryParams = parseQueryString(queryString)
  const { currentAdviserId } = state
  const {
    metadata,
    selectedAdvisers,
    selectedTeams,
    selectedCompanies,
    showDNBHierarchy,
  } = state[ID]
  const selectedFilters = buildSelectedFilters(
    queryParams,
    metadata,
    selectedAdvisers,
    selectedTeams,
    selectedCompanies,
    showDNBHierarchy
  )

  return {
    ...state[ID],
    payload: {
      ...queryParams,
      was_policy_feedback_provided: transformWasPolicyfeedBackProvidedToApi(
        queryParams.was_policy_feedback_provided
      ),
    },
    optionMetadata: {
      sortOptions: SORT_OPTIONS,
      ...metadata,
    },
    selectedFilters,
    currentAdviserId,
    showDNBHierarchy,
  }
}
