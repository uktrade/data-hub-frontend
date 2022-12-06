import {
  FLASH_MESSAGE__ADD_TO_STATE,
  FLASH_MESSAGE__CLEAR_FROM_STATE,
  LATEST_ANNOUNCEMENT__UPDATE_STATE,
} from '../../actions'

export default (state = {}, { type, flashMessages, announcementLink }) => {
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
    case LATEST_ANNOUNCEMENT__UPDATE_STATE:
      return {
        ...state,
        announcementLink,
      }
    default:
      return state
  }
}
