import { OBJECTIVE_LOADED } from '../../../../client/actions'

const initialState = { objectiveItem: null }

export default (state = initialState, { type, result }) => {
  switch (type) {
    case OBJECTIVE_LOADED:
      return {
        ...state,
        objectiveItem: result,
      }
    default:
      return state
  }
}
