import React from 'react'
import styled from 'styled-components'

import multiInstance from '../../utils/multiinstance'

import {
  TYPEAHEAD__FOCUS_OPTION,
  TYPEAHEAD__INPUT,
  TYPEAHEAD__MENU_CLOSE,
  TYPEAHEAD__MENU_OPEN,
  TYPEAHEAD__OPTION_TOGGLE,
  TYPEAHEAD__OPTION_REMOVE,
} from '../../actions'

import SelectedChips from './SelectedChips'
import { getActionFromKey, getUpdatedIndex, menuActions } from './utils'
import reducer from './reducer'

const FocusLabel = styled('label')(({ focussed }) => ({
  border: focussed ? 'solid #f00 3px' : 'none',
}))

// Show highlight over active item (can be selected by keyboard or hover)
const Typeahead = ({
  name,
  label = '',
  menuOpen,
  options = [],
  input = '',
  selectedOptions = [],
  focusIndex,
  onFocusChange,
  onInput,
  onOptionToggle,
  onOptionRemove,
  onMenuClose,
  onMenuOpen,
  value,
}) => {
  const filteredOptions = input
    ? options.filter((option) => option.label.startsWith(input))
    : options
  const activeId =
    menuOpen && filteredOptions[focusIndex]
      ? `${name}-${filteredOptions[focusIndex].value}`
      : ''
  const onInputKeyDown = (event) => {
    const max = filteredOptions.length - 1
    const action = getActionFromKey(event.code, menuOpen)
    switch (action) {
      case menuActions.next:
      case menuActions.last:
      case menuActions.first:
      case menuActions.previous:
        event.preventDefault()
        return onFocusChange(getUpdatedIndex(focusIndex, max, action))
      case menuActions.closeSelect:
        event.preventDefault()
        return onOptionToggle(filteredOptions[focusIndex])
      case menuActions.close:
        event.preventDefault()
        return onMenuClose()
      case menuActions.open:
        return onMenuOpen()
    }
  }
  return (
    <div id={name}>
      <label id={`${name}-label`}>{label}</label>
      <SelectedChips
        name={name}
        selectedOptions={selectedOptions}
        onOptionRemove={onOptionRemove}
      />
      <div>
        <input
          aria-activedescendant={activeId}
          aria-autocomplete="list"
          aria-controls={`${name}-listbox`}
          aria-expanded={menuOpen ? 'true' : 'false'}
          aria-haspopup="listbox"
          aria-labelledby={`${name} ${name}-selected`}
          role="combobox"
          type="text"
          value={value}
          // onBlur={onMenuClose} // Want to keep the listbox open...
          onClick={onMenuOpen}
          onChange={onInput}
          onKeyDown={onInputKeyDown}
        />
        <div
          role="listbox"
          aria-labelledby={`${name}-label`}
          aria-multiselectable="true"
          id={`${name}-listbox`}
          style={{ display: menuOpen ? 'inherit' : 'none' }}
        >
          {filteredOptions.map((option, index) => (
            <FocusLabel key={option.value} focussed={index === focusIndex}>
              <input
                role="option"
                id={`${name}-${option.value}`}
                type="checkbox"
                name={name}
                checked={selectedOptions.indexOf(option) > -1}
                aria-selected={selectedOptions.indexOf(option) > -1}
                onChange={() => onOptionToggle(option)}
                tabIndex={-1}
              />
              {option.label} - focus: {index === focusIndex ? 'Yes' : 'No'}
            </FocusLabel>
          ))}
        </div>
      </div>
    </div>
  )
}

export default multiInstance({
  name: 'Typeahead',
  actionPattern: 'TYPEAHEAD__',
  dispatchToProps: (dispatch) => ({
    onFocusChange: (focusIndex) => {
      dispatch({
        type: TYPEAHEAD__FOCUS_OPTION,
        focusIndex,
      })
    },
    onInput: (event) => {
      dispatch({
        type: TYPEAHEAD__INPUT,
        input: event.target.value,
      })
    },
    onMenuClose: () => {
      dispatch({
        type: TYPEAHEAD__MENU_CLOSE,
      })
    },
    onMenuOpen: () => {
      dispatch({
        type: TYPEAHEAD__MENU_OPEN,
      })
    },
    onOptionToggle: (option) => {
      dispatch({
        type: TYPEAHEAD__OPTION_TOGGLE,
        option,
      })
    },
    onOptionRemove: (option) => {
      dispatch({
        type: TYPEAHEAD__OPTION_REMOVE,
        option,
      })
    },
  }),
  component: Typeahead,
  reducer,
})
