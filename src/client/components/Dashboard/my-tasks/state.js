import { omitBy, isEmpty } from 'lodash'

import { getQueryParamsFromLocation } from '../../../../client/utils/url'
import { parsePage } from '../../../../client/utils/pagination'

import {
  SORT_BY_LIST_OPTIONS,
  STATUS_LIST_OPTIONS,
  ME_OTHERS_LIST_OPTIONS,
  SHOW_ALL_OPTION,
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

const statusMapping = {
  active: { status: 'active' },
  completed: { status: 'complete' },
}

export const state2props = ({ router, ...state }) => {
  const queryParams = getQueryParamsFromLocation(router.location)
  const { currentAdviserId } = state
  const payload = {
    ...queryParams,
    page: parsePage(queryParams.page),
    created_by: undefined,
    not_created_by: undefined,
    advisers: undefined,
    not_advisers: undefined,
    adviser: [currentAdviserId],
    archived: undefined,
    sortby: 'due_date:asc',
    company: undefined,
    project: undefined,
    status: undefined,
  }

  const assignedToMapping = {
    me: { advisers: [currentAdviserId] },
    others: { not_advisers: [currentAdviserId] },
  }
  const createdByMapping = {
    me: { created_by: currentAdviserId },
    others: { not_created_by: currentAdviserId },
  }

  if (queryParams.sortby in sortbyMapping) {
    payload.sortby = sortbyMapping[queryParams.sortby]
  }

  if (queryParams.company && queryParams.company !== SHOW_ALL_OPTION.value) {
    payload.company = queryParams.company
  }

  if (queryParams.project && queryParams.project !== SHOW_ALL_OPTION.value) {
    payload.project = queryParams.project
  }

  Object.assign(payload, assignedToMapping[queryParams.assigned_to])
  Object.assign(payload, createdByMapping[queryParams.created_by])
  Object.assign(payload, statusMapping[queryParams.status])

  return {
    ...state[ID],
    payload: payload,
    filters: {
      areActive: areFiltersActive(queryParams),
      assignedTo: {
        options: ME_OTHERS_LIST_OPTIONS,
      },
      createdBy: {
        options: ME_OTHERS_LIST_OPTIONS,
      },
      sortby: {
        options: SORT_BY_LIST_OPTIONS,
      },
      status: {
        options: STATUS_LIST_OPTIONS,
      },
    },
  }
}
