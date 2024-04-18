import { buildSelectedFilters } from './filters'
import { SORT_OPTIONS } from './constants'
import { locationToQSParamsWithPage } from '../../../utils/url'

export const TASK_GET_EVENTS_LIST = 'TASK_GET_EVENTS_LIST'
export const TASK_GET_EVENTS_METADATA = 'TASK_GET_EVENTS_METADATA'
export const TASK_GET_EVENTS_ORGANISER_NAME = 'TASK_GET_EVENTS_ORGANISER_NAME'
export const TASK_GET_ALL_ACTIVITY_FEED_EVENTS =
  'TASK_GET_ALL_ACTIVITY_FEED_EVENTS'

export const ID = 'eventsList'

/**
 * Convert both location and redux state to props
 */
export const state2props = ({ router, ...state }) => {
  const queryParams = locationToQSParamsWithPage(router.location)

  const { metadata, selectedOrganisers } = state[ID]

  const selectedFilters = buildSelectedFilters(
    queryParams,
    metadata,
    selectedOrganisers
  )

  return {
    ...state[ID],
    payload: { ...queryParams },
    page: queryParams.page,
    optionMetadata: {
      sortOptions: SORT_OPTIONS,
      ...metadata,
    },
    selectedFilters,
  }
}
