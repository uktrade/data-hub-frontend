import {
  FLASH_MESSAGE__ADD_TO_STATE,
  FLASH_MESSAGE__CLEAR_FROM_STATE,
  BANNER_DISMISSED__UPDATE_STATE,
} from '../../actions'

export default (state = {}, { type, flashMessages, isBannerDismissed }) => {
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
    case BANNER_DISMISSED__UPDATE_STATE:
      return {
        ...state,
        isBannerDismissed,
      }
    default:
      return state
  }
}
