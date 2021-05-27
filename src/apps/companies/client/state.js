import qs from 'qs'

export const TASK_GET_COMPANIES_LIST = 'TASK_GET_COMPANIES_LIST'

export const ID = 'companiesList'

const searchParamProps = ({ page = 1 }) => ({ page: parseInt(page, 10) })

const collectionListPayload = (paramProps) => {
  return Object.fromEntries(
    Object.entries(searchParamProps(paramProps)).filter((v) => v[1])
  )
}

/**
 * Convert both location and redux state to props
 */
export const state2props = ({ router, ...state }) => {
  const queryProps = qs.parse(router.location.search.slice(1))
  const filteredQueryProps = collectionListPayload(queryProps)
  return {
    ...state[ID],
    payload: filteredQueryProps,
    optionMetadata: { sortOptions: [] },
    selectedFilters: {},
  }
}
