import { xor } from 'lodash'

import {
  TYPEAHEAD__BLUR,
  TYPEAHEAD__FOCUS_OPTION,
  TYPEAHEAD__INPUT,
  TYPEAHEAD__MENU_CLOSE,
  TYPEAHEAD__MENU_OPEN,
  TYPEAHEAD__OPTION_MOUSE_DOWN,
  TYPEAHEAD__OPTION_TOGGLE,
  TYPEAHEAD__OPTION_REMOVE,
} from '../../actions'

const initialState = {
  menuOpen: false,
  focusIndex: 0,
  input: '',
  selectedOptions: [],
  ignoreBlur: false,
}

export default (state = initialState, { type, input, option, focusIndex }) => {
  switch (type) {
    case TYPEAHEAD__BLUR:
      return {
        ...state,
        menuOpen: state.ignoreBlur ? state.menuOpen : false,
        ignoreBlur: false,
      }
    case TYPEAHEAD__INPUT:
      return {
        ...state,
        input,
        focusIndex: 0,
      }
    case TYPEAHEAD__FOCUS_OPTION:
      return {
        ...state,
        focusIndex,
      }
    case TYPEAHEAD__MENU_CLOSE:
      return {
        ...state,
        menuOpen: false,
      }
    case TYPEAHEAD__MENU_OPEN:
      return {
        ...state,
        menuOpen: true,
      }
    case TYPEAHEAD__OPTION_MOUSE_DOWN:
      return {
        ...state,
        ignoreBlur: true,
      }
    case TYPEAHEAD__OPTION_TOGGLE:
      return {
        ...state,
        selectedOptions: xor(state.selectedOptions, [option]),
      }
    case TYPEAHEAD__OPTION_REMOVE:
      return {
        ...state,
        selectedOptions: state.selectedOptions.filter(
          (selectedOptionId) => selectedOptionId !== option
        ),
      }
    default:
      return state
  }
}
