import qs from 'qs'

export const TASK_GET_CONTACTS_LIST = 'TASK_GET_CONTACTS_LIST'
export const ID = 'contactsList'

const searchParamProps = ({ page = 1 }) => ({ page: parseInt(page, 10) })

const collectionListPayload = (paramProps) => {
  return Object.fromEntries(
    Object.entries(searchParamProps(paramProps)).filter((v) => v[1])
  )
}

export const state2props = ({ router, ...state }) => {
  const queryProps = qs.parse(router.location.search.slice(1))
  const filteredQueryProps = collectionListPayload(queryProps)
  const obj = {
    ...state[ID],
    selectedFilters: {},
    payload: filteredQueryProps,
    optionMetadata: { sortOptions: [] },
  }

  return obj
}
