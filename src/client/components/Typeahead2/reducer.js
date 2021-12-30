import { isEqual, xorWith } from 'lodash'

import {
  TYPEAHEAD__BLUR,
  TYPEAHEAD__SET_ACTIVE_OPTION,
  TYPEAHEAD__INPUT,
  TYPEAHEAD__INITIALISE,
  TYPEAHEAD__MENU_CLOSE,
  TYPEAHEAD__MENU_OPEN,
  TYPEAHEAD__OPTION_MOUSE_DOWN,
  TYPEAHEAD__OPTION_TOGGLE,
  TYPEAHEAD__OPTION_REMOVE,
  TYPEAHEAD__OPTIONS_LOADED,
} from '../../actions'

import { getFilteredOptions, valueAsArray } from './utils'

const initialState = {
  menuOpen: false,
  activeIndex: -1,
  focusIndex: -1,
  input: '',
  selectedOptions: [],
  options: [],
  ignoreBlur: false,
  isMulti: true,
}

export default (
  state = initialState,
  { type, value, input, isMulti, option, activeIndex, focusIndex, result }
) => {
  const selectedValue = !state.isMulti && state.selectedOptions[0]?.label
  const filteredOptions = getFilteredOptions({
    options: state.options,
    input: state.input,
  })

  switch (type) {
    case TYPEAHEAD__INITIALISE:
      return {
        ...state,
        isMulti,
        selectedOptions: valueAsArray(value),
        input: isMulti ? state.input : valueAsArray(value)[0]?.label,
      }
    case TYPEAHEAD__OPTIONS_LOADED:
      return {
        ...state,
        options: result,
        activeIndex: getFilteredOptions({
          options: result,
          input: state.input,
        }).indexOf(filteredOptions[state.activeIndex]),
      }
    case TYPEAHEAD__BLUR:
      return {
        ...state,
        menuOpen: state.ignoreBlur ? state.menuOpen : false,
        focusIndex: -1,
        input: state.ignoreBlur
          ? state.input
          : (state.input && selectedValue) || '',
        ignoreBlur: false,
      }
    case TYPEAHEAD__INPUT:
      return {
        ...state,
        input,
        activeIndex: getFilteredOptions({
          options: state.options,
          input,
        }).indexOf(filteredOptions[state.activeIndex]),
        menuOpen: true,
      }
    case TYPEAHEAD__SET_ACTIVE_OPTION:
      return {
        ...state,
        activeIndex,
      }
    case TYPEAHEAD__MENU_CLOSE:
      return {
        ...state,
        menuOpen: false,
      }
    case TYPEAHEAD__MENU_OPEN:
      const selectedIndex = state.options
        .map(({ label }) => label)
        .indexOf(selectedValue)
      return {
        ...state,
        menuOpen: true,
        activeIndex: selectedIndex,
      }
    case TYPEAHEAD__OPTION_MOUSE_DOWN:
      return {
        ...state,
        ignoreBlur: true,
        focusIndex,
      }
    case TYPEAHEAD__OPTION_TOGGLE:
      const newInput = state.isMulti ? state.input : option.label
      const toggledIndex = getFilteredOptions({
        options: state.options,
        input: state.isMulti && newInput,
      }).indexOf(option)
      return {
        ...state,
        selectedOptions: state.isMulti
          ? xorWith(state.selectedOptions, [option], isEqual)
          : [option],
        input: newInput,
        activeIndex: toggledIndex,
        focusIndex: toggledIndex,
      }
    case TYPEAHEAD__OPTION_REMOVE:
      return {
        ...state,
        selectedOptions: state.selectedOptions.filter(
          ({ value }) => value !== option.value
        ),
      }
    default:
      return state
  }
}
