import _ from 'lodash'
import {
  COMPANY_LISTS__LISTS_LOADED,
  COMPANY_LISTS__SELECT,
  COMPANY_LISTS__COMPANIES_LOADED,
  COMPANY_LISTS__FILTER,
  COMPANY_LISTS__ORDER,
} from '../../actions'

import { RECENT } from './Filters'

const initialState = {
  orderBy: RECENT,
}

export default (state = initialState, { type, ...action }) => ({
  ...state,
  ...({
    [COMPANY_LISTS__LISTS_LOADED]: ({ result }) => ({
      lists: _.mapValues(result, (title) => ({ title })),
      selectedId: Object.keys(result)[0],
    }),
    [COMPANY_LISTS__COMPANIES_LOADED]: ({ payload, result }) => ({
      lists: {
        ...state.lists,
        [payload]: {
          ...state.lists[payload],
          companies: result,
        },
      },
    }),
    [COMPANY_LISTS__SELECT]: ({ id }) => ({ selectedId: id, query: '' }),
    [COMPANY_LISTS__FILTER]: _.identity,
    [COMPANY_LISTS__ORDER]: _.identity,
  }[type] || (() => state))(action),
})
