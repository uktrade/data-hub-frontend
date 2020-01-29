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

export default (
  state = initialState,
  { type, id, result, payload, query, orderBy }
) => {
  switch (type) {
    case COMPANY_LISTS__LISTS_LOADED:
      return {
        ...state,
        lists: _.mapValues(result, (name) => ({ name })),
        selectedId: Object.keys(result)[0],
      }
    case COMPANY_LISTS__COMPANIES_LOADED:
      return {
        ...state,
        lists: {
          ...state.lists,
          [payload]: {
            ...state.lists[payload],
            companies: result,
          },
        },
      }
    case COMPANY_LISTS__SELECT:
      return {
        ...state,
        selectedId: id,
        query: '',
      }
    case COMPANY_LISTS__FILTER:
      return { ...state, query }
    case COMPANY_LISTS__ORDER:
      return { ...state, orderBy }
    default:
      return state
  }
}
