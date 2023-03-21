import { isEmpty, omitBy } from 'lodash'
import qs from 'qs'
import { SORT_OPTIONS } from '../../../../../client/modules/Contacts/CollectionList/constants'

export const OVERVIEW_COMPANY_PROJECTS_LIST_ID = 'overviewCompanyProjectsList'
export const TASK_GET_PROJECT_WON_COUNT = 'TASK_GET_PROJECT_WON_COUNT'

const parseQueryString = (queryString) => {
  const queryParams = omitBy({ ...qs.parse(queryString) }, isEmpty)
  return {
    ...queryParams,
    page: parseInt(queryParams.page || 1, 10),
  }
}

export const companyProjectsState2props = ({ router, ...state }) => {
  const queryString = router.location.search.slice(1)
  const queryParams = parseQueryString(queryString)

  return {
    ...state[OVERVIEW_COMPANY_PROJECTS_LIST_ID],
    payload: { ...queryParams },
    optionMetadata: {
      sortOptions: SORT_OPTIONS,
    },
  }
}
