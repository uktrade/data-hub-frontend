import { COMPANY_LISTS__COMPANY_IN_LOADED } from '../../actions'

const initialState = {
  count: 0,
  results: [],
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case COMPANY_LISTS__COMPANY_IN_LOADED:
      return {
        ...state,
        ...result,
      }
    default:
      return state
  }
}
