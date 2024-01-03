import { COMPANY_LOADED } from '../../../../client/actions'

const initialState = { company: null }

export default (state = initialState, { type, result }) => {
  switch (type) {
    case COMPANY_LOADED:
      return {
        ...state,
        company: result,
      }
    default:
      return state
  }
}
