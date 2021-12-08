import { xor } from 'lodash'

import {
  TYPEAHEAD__BLUR,
  TYPEAHEAD__FOCUS_OPTION,
  TYPEAHEAD__INPUT,
  TYPEAHEAD__INITIALISE,
  TYPEAHEAD__MENU_CLOSE,
  TYPEAHEAD__MENU_OPEN,
  TYPEAHEAD__OPTION_MOUSE_DOWN,
  TYPEAHEAD__OPTION_TOGGLE,
  TYPEAHEAD__OPTION_REMOVE,
} from '../../actions'

import { getFilteredOptions, valueAsArray } from './utils'

const initialState = {
  initialised: false,
  menuOpen: false,
  focusIndex: -1,
  input: '',
  selectedOptions: [],
  options: [],
  ignoreBlur: false,
  isMulti: true,
}

export default (
  state = initialState,
  { type, value, input, isMulti, option, options, focusIndex }
) => {
  const selectedValue = !state.isMulti && state.selectedOptions[0]?.label
  const filteredOptions = getFilteredOptions({
    options: state.options,
    input: state.input,
  })

  switch (type) {
    case TYPEAHEAD__INITIALISE:
      const useInitialValue = !state.initialised && value
      return {
        ...state,
        options,
        isMulti,
        selectedOptions: useInitialValue
          ? valueAsArray(value)
          : state.selectedOptions,
        input:
          useInitialValue && !isMulti
            ? valueAsArray(value)[0]?.label
            : state.input,
        initialised: true,
      }
    case TYPEAHEAD__BLUR:
      return {
        ...state,
        menuOpen: state.ignoreBlur ? state.menuOpen : false,
        input: state.ignoreBlur
          ? state.input
          : (state.input && selectedValue) || '',
        ignoreBlur: false,
      }
    case TYPEAHEAD__INPUT:
      return {
        ...state,
        input,
        focusIndex: getFilteredOptions({
          options: state.options,
          input,
        }).indexOf(filteredOptions[state.focusIndex]),
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
      const selectedIndex = state.options
        .map(({ label }) => label)
        .indexOf(selectedValue)
      return {
        ...state,
        menuOpen: true,
        focusIndex: selectedIndex,
      }
    case TYPEAHEAD__OPTION_MOUSE_DOWN:
      return {
        ...state,
        ignoreBlur: true,
      }
    case TYPEAHEAD__OPTION_TOGGLE:
      const newInput = state.isMulti ? state.input : option.label
      return {
        ...state,
        selectedOptions: state.isMulti
          ? xor(state.selectedOptions, [option])
          : [option],
        input: newInput,
        focusIndex: getFilteredOptions({
          options: state.options,
          input: state.isMulti && newInput,
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
