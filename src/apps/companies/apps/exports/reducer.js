import { EXPORTS_HISTORY } from '../../../../client/actions'

const initialState = {
  loading: true,
  count: 0,
  results: [],
}

export default (state = initialState, { id, type, payload, result }) => {
  switch (type) {
    case EXPORTS_HISTORY:
      const { count, results } = result
      return {
        ...state,
        loading: false,
        count,
        results,
      }
    default:
      return state
  }
}
