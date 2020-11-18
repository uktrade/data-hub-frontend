import qs from 'qs'

import { sectorOptions } from './labels'

export const TASK_GET_PROJECTS_LIST = 'TASK_GET_PROJECTS_LIST'
export const TASK_GET_ADVISER_NAME = 'TASK_GET_ADVISER_NAME'

export const ID = 'projectsList'

const parseVariablePropType = (prop) =>
  prop ? (Array.isArray(prop) ? prop : [prop]) : prop

const searchParamProps = ({
  adviser = false,
  sector = false,
  sortby = 'created_on:desc',
  page = 1,
}) => ({
  adviser: parseVariablePropType(adviser),
  sector: parseVariablePropType(sector),
  sortby,
  page,
})

const collectionListPayload = (paramProps) => {
  return Object.fromEntries(
    Object.entries(searchParamProps(paramProps)).filter((v) => v[1])
  )
}

const getOptionMetadata = ({ sector }) => ({
  sectors: sector
    ? sectorOptions.filter((option) => sector.includes(option.value))
    : [],
})

export const state2props = ({ router, ...state }) => {
  const queryProps = qs.parse(router.location.search.slice(1))
  return {
    ...state[ID],
    payload: collectionListPayload(queryProps),
    optionMetadata: getOptionMetadata(queryProps),
  }
}
