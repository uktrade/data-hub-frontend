import _ from 'lodash'
import {
  COMPANY_LIST_2__LISTS_LOADED,
  COMPANY_LIST_2__SELECT,
  COMPANY_LIST_2__COMPANIES_LOADED,
  COMPANY_LIST_2__FILTER,
  COMPANY_LIST_2__ORDER,
} from '../../actions'

import { RECENT } from './Filters'

const initialState = {
  orderBy: RECENT,
}

export default (state = initialState, { type, ...action }) => ({
  ...state,
  ...({
    [COMPANY_LIST_2__LISTS_LOADED]: ({ result }) => ({
      lists: _.mapValues(result, (title) => ({ title })),
      selectedId: Object.keys(result)[0],
    }),
    [COMPANY_LIST_2__COMPANIES_LOADED]: ({ payload, result }) => ({
      lists: {
        ...state.lists,
        [payload]: {
          ...state.lists[payload],
          companies: result,
        },
      },
    }),
    [COMPANY_LIST_2__SELECT]: ({ id }) => ({ selectedId: id, query: '' }),
    [COMPANY_LIST_2__FILTER]: _.identity,
    [COMPANY_LIST_2__ORDER]: _.identity,
  }[type] || (() => state))(action),
})
