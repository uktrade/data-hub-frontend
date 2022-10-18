import {
  FLASH_MESSAGE__ADD_TO_STATE,
  FLASH_MESSAGE__CLEAR_FROM_STATE,
  IS_BANNER_DISMISSED__ADD_TO_STATE,
} from '../../actions'

export default (
  state = {},
  { type, flashMessages, isBannerDismissedState }
) => {
  switch (type) {
    case FLASH_MESSAGE__ADD_TO_STATE:
      return {
        ...state,
        flashMessages,
      }
    case FLASH_MESSAGE__CLEAR_FROM_STATE:
      return {
        ...state,
        flashMessages: {},
      }
    case IS_BANNER_DISMISSED__ADD_TO_STATE:
      return {
        ...state,
        isBannerDismissedState,
      }
    default:
      return state
  }
}
