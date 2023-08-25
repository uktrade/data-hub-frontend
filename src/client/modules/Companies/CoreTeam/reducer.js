import { ONE_LIST_DETAILS_LOADED } from '../../../../client/actions'

const initialState = { company: null, oneListTeam: null, oneListTiers: null }

export default (state = initialState, { type, result }) => {
  switch (type) {
    case ONE_LIST_DETAILS_LOADED:
      return {
        ...state,
        ...result,
      }
    default:
      return state
  }
}
