import {
  EXPORT_WINS__LOADED,
  EXPORT_WINS__SELECT_PAGE,
} from '../../../../../../client/actions'

import { NOT_IMPLEMENTED } from './state'

const initialState = {
  count: 0,
  results: [],
  activePage: 1,
}

export default (state = initialState, { type, result, page }) => {
  switch (type) {
    case EXPORT_WINS__LOADED:
      if (result[NOT_IMPLEMENTED]) {
        return {
          ...state,
          [NOT_IMPLEMENTED]: true,
        }
      }

      const { count, results } = result

      return {
        ...state,
        count,
        results,
        isComplete: true,
      }
    case EXPORT_WINS__SELECT_PAGE:
      return {
        ...state,
        activePage: page,
      }
    default:
      return state
  }
}
