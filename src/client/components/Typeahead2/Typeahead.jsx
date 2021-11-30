import React from 'react'
import styled from 'styled-components'

import multiInstance from '../../utils/multiinstance'

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

import SelectedChips from './SelectedChips'
import { getActionFromKey, getUpdatedIndex, menuActions } from './utils'
import reducer from './reducer'

const ListboxOption = styled('div')((props) => ({
  border: props.focussed ? 'solid #f00 3px' : 'none',
  paddingLeft: 20, // use a constant
  position: 'relative',

  '::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    width: 15,
    height: 15,
    backgroundColor: props['aria-selected'] ? 'red' : 'none',
    border: 'solid 1px #333',
  },
}))

const Menu = styled('div')(({ open }) => ({
  display: open ? 'block' : 'none',
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
  onBlur,
  onFocusChange,
  onInput,
  onOptionMouseDown,
  onOptionToggle,
  onOptionRemove,
  onMenuClose,
  onMenuOpen,
  value,
}) => {
  const inputRef = React.useRef(null)
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
        onFocusChange(getUpdatedIndex(focusIndex, max, action))
        return
      case menuActions.closeSelect:
        event.preventDefault()
        onOptionToggle(filteredOptions[focusIndex])
        // Single select - close menu
        // Multi select - keep open
        return
      case menuActions.close:
        event.preventDefault()
        onMenuClose()
        return
      case menuActions.open:
        onMenuOpen()
        return
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
          aria-labelledby={`${name}-label ${name}-selected`}
          role="combobox"
          type="text"
          value={value}
          onBlur={onBlur}
          onClick={onMenuOpen}
          onInput={onInput}
          onKeyDown={onInputKeyDown}
          ref={inputRef}
        />
        <Menu
          id={`${name}-listbox`}
          open={menuOpen}
          role="listbox"
          aria-labelledby={`${name}-label`}
          aria-multiselectable="true"
        >
          {filteredOptions.map((option, index) => (
            <ListboxOption
              id={`${name}-${option.value}`}
              key={option.value}
              focussed={index === focusIndex}
              role="option"
              aria-selected={selectedOptions.indexOf(option) > -1}
              onClick={() => {
                inputRef.current && inputRef.current.focus()
                onOptionToggle(option)
              }}
              onMouseDown={() => onOptionMouseDown()}
              onMouseEnter={() => onFocusChange(index)}
            >
              {option.label}
            </ListboxOption>
          ))}
        </Menu>
      </div>
    </div>
  )
}

export default multiInstance({
  name: 'Typeahead',
  actionPattern: 'TYPEAHEAD__',
  dispatchToProps: (dispatch) => ({
    onBlur: () => {
      dispatch({
        type: TYPEAHEAD__BLUR,
      })
    },
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
    onOptionMouseDown: () => {
      dispatch({
        type: TYPEAHEAD__OPTION_MOUSE_DOWN,
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
