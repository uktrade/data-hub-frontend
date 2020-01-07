import { orderBy } from 'lodash'

import {
  COMPANY_LIST_VIEWER__FILTER,
  COMPANY_LIST_VIEWER__LIST_CHANGE,
  COMPANY_LIST_VIEWER__ORDER,
} from '../../../../client/actions'
import { RECENT } from './constants'

export const initialState = {
  lists: [],
  selectedIdx: 0,
  sortBy: RECENT,
  filter: '',
}

export const resolvePreloadedData = () => {
  const element = document.querySelector('#my-companies')
  return element
    ? {
        ...initialState,
        lists: orderBy(JSON.parse(element.dataset.props).lists, 'name'),
      }
    : initialState
}

export default (state = initialState, { type, ...action }) => {
  switch (type) {
    case COMPANY_LIST_VIEWER__LIST_CHANGE:
      return { ...state, filter: '', selectedIdx: action.idx }
    case COMPANY_LIST_VIEWER__FILTER:
      return { ...state, filter: action.filter }
    case COMPANY_LIST_VIEWER__ORDER:
      return { ...state, sortBy: action.sortBy }
    default:
      return state
  }
}
