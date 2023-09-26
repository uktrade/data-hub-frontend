import qs from 'qs'
import { sortOptions } from './metadata'

export const TASK_GET_OPPORTUNITIES_LIST = 'TASK_GET_OPPORTUNITIES_LIST'

export const ID = 'opportunitiesList'

const searchParamProps = ({ sortby = 'created_on:desc', page = 1 }) => ({
  sortby,
  page,
})

const collectionListPayload = (paramProps) => {
  return Object.fromEntries(
    Object.entries(searchParamProps(paramProps)).filter((v) => v[1])
  )
}

export const state2props = ({ router, ...state }) => {
  const { metadata } = state.opportunitiesList
  const queryProps = qs.parse(router.location.search.slice(1))
  const filteredQueryProps = collectionListPayload(queryProps)

  return {
    ...state[ID],
    payload: filteredQueryProps,
    optionMetadata: { sortOptions, ...metadata },
    router,
  }
}
