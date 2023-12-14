import { omitBy, isEmpty } from 'lodash'

import { getQueryParamsFromLocation } from '../../../../client/utils/url'
import { parsePage } from '../../../../client/utils/pagination'

import {
  ASSIGNED_TO_LIST_OPTIONS,
  CREATED_BY_LIST_OPTIONS,
  SORT_BY_LIST_OPTIONS,
} from './constants'

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

const sortbyMapping = {
  due_date: 'due_date:asc',
  recently_updated: 'modified_on:desc',
  least_recently_updated: 'modified_on:asc',
  company_ascending: 'company.name:asc',
  project_ascending: 'investment_project.name:asc',
}

export const state2props = ({ router, ...state }) => {
  const queryParams = getQueryParamsFromLocation(router.location)
  const { currentAdviserId } = state
  const payload = {
    ...queryParams,
    page: parsePage(queryParams.page),
    created_by: undefined,
    advisers: undefined,
    not_created_by: undefined,
    not_advisers: undefined,
    adviser: [currentAdviserId],
    sortby: 'due_date:asc',
  }

  if (queryParams.created_by === 'me') {
    payload.created_by = currentAdviserId
  }

  if (queryParams.created_by === 'others') {
    payload.not_created_by = currentAdviserId
  }

  if (queryParams.assigned_to === 'me') {
    payload.advisers = [currentAdviserId]
  }

  if (queryParams.assigned_to === 'others') {
    payload.not_advisers = [currentAdviserId]
  }

  if (queryParams.sortby in sortbyMapping) {
    payload.sortby = sortbyMapping[queryParams.sortby]
  }

  return {
    ...state[ID],
    payload: payload,
    filters: {
      areActive: areFiltersActive(queryParams),
      assignedTo: {
        options: ASSIGNED_TO_LIST_OPTIONS,
      },
      createdBy: {
        options: CREATED_BY_LIST_OPTIONS,
      },
      sortby: {
        options: SORT_BY_LIST_OPTIONS,
      },
    },
  }
}
