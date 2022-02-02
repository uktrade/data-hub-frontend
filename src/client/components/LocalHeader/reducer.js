import {
  FLASH_MESSAGE__ADD_TO_STATE,
  FLASH_MESSAGE__CLEAR_FROM_STATE,
} from '../../actions'

export default (state = {}, { type, flashMessages }) => {
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
    default:
      return state
  }
}
