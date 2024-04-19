import { buildSelectedFilters } from './filters'
import { SORT_OPTIONS } from './constants'
import { transformWasPolicyfeedBackProvidedToApi } from './transformers'
import { locationToQSParamsWithPage } from '../../../utils/url'

export const TASK_GET_INTERACTIONS_LIST = 'TASK_GET_INTERACTIONS_LIST'
export const TASK_GET_INTERACTIONS_ADVISER_NAME =
  'TASK_GET_INTERACTIONS_ADVISER_NAME'
export const TASK_GET_INTERACTIONS_METADATA = 'TASK_GET_INTERACTIONS_METADATA'
export const TASK_GET_INTERACTIONS_TEAM_NAME = 'TASK_GET_INTERACTIONS_TEAM_NAME'
export const TASK_GET_INTERACTIONS_COMPANY_NAME =
  'TASK_GET_INTERACTIONS_COMPANY_NAME'

export const ID = 'interactionsList'

export const state2props = ({ router, ...state }) => {
  const queryParams = locationToQSParamsWithPage(router.location)
  const { currentAdviserId } = state
  const { metadata, selectedAdvisers, selectedTeams, selectedCompanies } =
    state[ID]
  const selectedFilters = buildSelectedFilters(
    queryParams,
    metadata,
    selectedAdvisers,
    selectedTeams,
    selectedCompanies
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
  }
}
