import qs from 'qs'
import { omit } from 'lodash'

export const TASK_GET_PROJECTS_LIST = 'TASK_GET_PROJECTS_LIST'
export const TASK_GET_ADVISER_NAME = 'TASK_GET_ADVISER_NAME'

export const ID = 'projectsList'

const collectionListPayload = ({
  adviser = false,
  sortby = 'created_on:desc',
  page = 1,
}) => {
  const searchParamProps = {
    adviser: adviser ? (Array.isArray(adviser) ? adviser : [adviser]) : adviser,
    sortby,
    page,
  }

  let keysToDelete = []

  Object.keys(searchParamProps).forEach((key) => {
    searchParamProps[key] === false && keysToDelete.push(key)
  })
  return omit(searchParamProps, keysToDelete)
}

export const state2props = ({ router, ...state }) => ({
  ...state[ID],
  payload: collectionListPayload(qs.parse(router.location.search.slice(1))),
})
