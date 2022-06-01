import { GET_USER_FEATURE_FLAGS__COMPLETED } from '../../actions'

export default (state = {}, { type, userFeatureFlags }) => {
  switch (type) {
    case GET_USER_FEATURE_FLAGS__COMPLETED:
      return {
        ...state,
        userFeatureFlags,
      }
    default:
      return state
  }
}
