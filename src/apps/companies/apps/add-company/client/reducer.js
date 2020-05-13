import { ADD_COMPANY__REGION_LOADED } from '../../../../../client/actions'

export default (state = {}, { type, result }) => {
  if (type === ADD_COMPANY__REGION_LOADED) {
    return {
      ...state,
      region: result,
    }
  }

  return state
}
