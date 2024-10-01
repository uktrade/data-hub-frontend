import { parseQueryString } from '../../../utils'
import { transformLeadToListItem } from './transformers'

export const INVESTMENT_EYB_LEADS_ID = 'eybLeads'

export const TASK_GET_EYB_LEADS_LIST = 'TASK_GET_EYB_LEADS_LIST'
export const TASK_GET_EYB_LEADS_METADATA = 'TASK_GET_EYB_LEADS_METADATA'
export const TASK_GET_EYB_LEAD = 'TASK_GET_EYB_LEAD'

export const state2props = ({ router: { location }, ...state }) => {
  const queryString = location.search.slice(1)
  const queryParams = parseQueryString(queryString)
  const { filterOptions, results } = state[INVESTMENT_EYB_LEADS_ID]
  return {
    ...state[INVESTMENT_EYB_LEADS_ID],
    results: results.map(transformLeadToListItem),
    payload: queryParams,
    filterOptions,
  }
}
