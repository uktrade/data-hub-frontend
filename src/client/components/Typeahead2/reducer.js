import { xor } from 'lodash'

import {
  TYPEAHEAD__BLUR,
  TYPEAHEAD__FOCUS_OPTION,
  TYPEAHEAD__INPUT,
  TYPEAHEAD__LOAD_OPTIONS,
  TYPEAHEAD__MENU_CLOSE,
  TYPEAHEAD__MENU_OPEN,
  TYPEAHEAD__OPTION_MOUSE_DOWN,
  TYPEAHEAD__OPTION_TOGGLE,
  TYPEAHEAD__OPTION_REMOVE,
} from '../../actions'

import { getFilteredOptions } from './utils'

const initialState = {
  menuOpen: false,
  focusIndex: -1,
  input: '',
  selectedOptions: [],
  options: [],
  ignoreBlur: false,
}

export default (
  state = initialState,
  { type, input, isMulti, option, options, focusIndex }
) => {
  switch (type) {
    case TYPEAHEAD__LOAD_OPTIONS:
      return {
        ...state,
        options,
      }
    case TYPEAHEAD__BLUR:
      return {
        ...state,
        menuOpen: state.ignoreBlur ? state.menuOpen : false,
        ignoreBlur: false,
      }
    case TYPEAHEAD__INPUT:
      const activeOption = getFilteredOptions({
        options: state.options,
        input: state.input,
      })[state.focusIndex]
      return {
        ...state,
        input,
        focusIndex: getFilteredOptions({
          options: state.options,
          input,
        }).indexOf(activeOption),
        menuOpen: true,
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
      const newInput = isMulti ? state.input : option.label
      return {
        ...state,
        selectedOptions: isMulti
          ? xor(state.selectedOptions, [option])
          : [option],
        input: newInput,
        focusIndex: getFilteredOptions({
          options: state.options,
          input: isMulti && newInput,
        }).indexOf(option),
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
