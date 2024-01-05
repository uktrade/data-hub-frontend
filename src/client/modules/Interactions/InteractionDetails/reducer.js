import { INTERACTION__LOADED } from '../../../actions'

const initialState = {
  interaction: undefined,
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case INTERACTION__LOADED:
      return {
        ...state,
        interaction: result,
      }
    default:
      return state
  }
}
