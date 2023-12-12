import { omitBy, isEmpty } from 'lodash'

import { getQueryParamsFromLocation } from '../../../../client/utils/url'
import { parsePage } from '../../../../client/utils/pagination'

import { CREATED_BY_LIST_OPTIONS, SORT_BY_LIST_OPTIONS } from './constants'

export const ID = 'getMyTasks'
export const TASK_GET_MY_TASKS = 'TASK_GET_MY_TASKS'

const areFiltersActive = (queryParams) => {
  const filters = omitBy(
    queryParams,
    (filterValue, filterName) =>
      filterValue === 'all-statuses' || filterName === 'page'
  )

  return !isEmpty(filters)
}

export const state2props = ({ router, ...state }) => {
  const queryParams = getQueryParamsFromLocation(router.location)
  const { currentAdviserId } = state
  const payload = {
    ...queryParams,
    page: parsePage(queryParams.page),
    created_by: undefined,
    not_created_by: undefined,
    adviser: [currentAdviserId],
    sortby: 'due_date:asc',
  }
  if (queryParams.created_by === 'me') {
    payload.created_by = currentAdviserId
  }

  if (queryParams.created_by === 'others') {
    payload.not_created_by = currentAdviserId
  }
  if (queryParams.sortby === 'due_date') {
    payload.sortby = 'due_date:asc'
  }
  if (queryParams.sortby === 'recently_updated') {
    payload.sortby = 'modified_on:desc'
  }
  if (queryParams.sortby === 'least_recently_updated') {
    payload.sortby = 'modified_on:asc'
  }
  if (queryParams.sortby === 'company_ascending') {
    payload.sortby = 'company.name:asc'
  }
  if (queryParams.sortby === 'project_ascending') {
    payload.sortby = 'investment_project.name:asc'
  }
  return {
    ...state[ID],
    payload: payload,
    filters: {
      areActive: areFiltersActive(queryParams),
      createdBy: {
        options: CREATED_BY_LIST_OPTIONS,
      },
      sortby: {
        options: SORT_BY_LIST_OPTIONS,
      },
    },
  }
}
