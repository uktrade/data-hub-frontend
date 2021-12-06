import React from 'react'
import styled from 'styled-components'
import {
  BLACK,
  BLUE,
  FOCUS_COLOUR,
  GREY_1,
  GREY_2,
  TEXT_COLOUR,
  WHITE,
} from 'govuk-colours'
import { FOCUSABLE, SPACING } from '@govuk-react/constants'
import Label from '@govuk-react/label'
import multiInstance from '../../utils/multiinstance'

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

import Highlighter from '../Typeahead/Highlighter'
import AssistiveText from './AssistiveText'
import SelectedChips from './SelectedChips'
import {
  getActionFromKey,
  getFilteredOptions,
  getUpdatedIndex,
  maintainScrollVisibility,
  menuActions,
} from './utils'
import reducer from './reducer'

const ListboxOption = styled('div')((props) => ({
  padding: props.isMulti
    ? `${SPACING.SCALE_3} 0 ${SPACING.SCALE_3} 38px`
    : SPACING.SCALE_3,
  borderBottom: `solid 1px ${GREY_2}`,
  position: 'relative',
  boxSizing: 'border-box',
  height: 50,
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  backgroundColor: props.focussed ? BLUE : WHITE,
  color: props.focussed ? WHITE : TEXT_COLOUR,

  '&:last-child': {
    borderBottom: 'none',
  },
  '::before': {
    content: props.isMulti ? '""' : '',
    position: 'absolute',
    left: 5,
    top: 'calc(50% - 10px)',
    width: 20,
    height: 20,
    boxSizing: 'border-box',
    border: 'solid 1px',
    outline: props.focussed ? `3px solid ${FOCUS_COLOUR}` : 'none',
    outlineOffset: 0,
  },
  '::after': {
    display: props['aria-selected'] ? 'block' : 'none',
    content: props.isMulti ? '""' : '',
    position: 'absolute',
    left: 12,
    top: 'calc(50% - 2px)',
    width: 5,
    height: 12,
    borderRight: '2px solid',
    borderBottom: '2px solid',
    transform: 'translate(0, -50%) rotate(45deg)',
  },
}))

const NoOptionsMessage = styled('div')({
  padding: `${SPACING.SCALE_3} 0`,
  boxSizing: 'border-box',
  height: 50,
  textAlign: 'center',
  color: GREY_1,
})

const InputWrapper = styled('div')({
  position: 'relative',

  '&::after': {
    borderBottom: `2px solid ${BLACK}`,
    borderRight: `2px solid ${BLACK}`,
    content: '""',
    display: 'block',
    height: 12,
    pointerEvents: 'none',
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: 'translate(0, -65%) rotate(45deg)',
    width: 12,
  },
})

const AutocompleteInput = styled('input')(FOCUSABLE, {
  backgroundColor: WHITE,
  boxSizing: 'border-box',
  border: `2px solid ${BLACK}`,
  display: 'block',
  fontSize: '1em',
  padding: '8px 12px 10px',
  textAlign: 'left',
  width: '100%',
})

const Menu = styled('div')(({ open }) => ({
  display: open ? 'block' : 'none',
  backgroundColor: WHITE,
  boxSizing: 'border-box',
  border: `1px solid ${BLACK}`,
  maxHeight: 300,
  overflowY: 'scroll',
  left: 0,
  position: 'absolute',
  top: '100%',
  width: '100%',
  zIndex: 100,
}))

const Typeahead = ({
  name,
  label = '',
  closeMenuOnSelect = false,
  isMulti = true,
  menuOpen,
  options = [],
  input = '',
  selectedOptions = [],
  focusIndex,
  loadOptions,
  onBlur,
  onFocusChange,
  onInput,
  onOptionMouseDown,
  onOptionToggle,
  onOptionRemove,
  onMenuClose,
  onMenuOpen,
}) => {
  const inputRef = React.useRef(null)
  const menuRef = React.useRef(null)
  loadOptions(options)
  const ignoreFilter =
    !isMulti && selectedOptions.map(({ label }) => label).includes(input)
  const filteredOptions = getFilteredOptions({
    options,
    input: !ignoreFilter && input,
  })
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
        const newFocusIndex = getUpdatedIndex(focusIndex, max, action)
        onFocusChange(newFocusIndex)
        maintainScrollVisibility({
          parent: menuRef.current,
          target: menuRef.current.children[newFocusIndex],
        })
        return
      case menuActions.closeSelect:
        event.preventDefault()
        if (filteredOptions[focusIndex]) {
          onOptionToggle({ option: filteredOptions[focusIndex], isMulti })
        }
        if (closeMenuOnSelect) {
          onMenuClose()
        }
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
      <Label id={`${name}-label`}>{label}</Label>
      {isMulti && Boolean(selectedOptions.length) && (
        <SelectedChips
          name={name}
          selectedOptions={selectedOptions}
          onOptionRemove={onOptionRemove}
        />
      )}
      <InputWrapper>
        <AutocompleteInput
          aria-activedescendant={activeId}
          aria-autocomplete="list"
          aria-controls={`${name}-listbox`}
          aria-expanded={menuOpen ? 'true' : 'false'}
          aria-haspopup="listbox"
          aria-labelledby={`${name}-label ${name}-selected`}
          role="combobox"
          type="text"
          value={input}
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
          ref={menuRef}
        >
          {filteredOptions.map((option, index) => (
            <ListboxOption
              id={`${name}-${option.value}`}
              key={option.value}
              focussed={index === focusIndex}
              isMulti={isMulti}
              role="option"
              aria-selected={selectedOptions.indexOf(option) > -1}
              aria-setsize={filteredOptions.length}
              aria-posinset={index}
              onClick={() => {
                inputRef.current && inputRef.current.focus()
                onOptionToggle({ option, isMulti })
                if (closeMenuOnSelect) {
                  onMenuClose()
                }
              }}
              onMouseMove={() => {
                onFocusChange(index)
              }}
              onMouseDown={() => {
                onOptionMouseDown()
              }}
            >
              <Highlighter optionLabel={option.label} searchStr={input} />
            </ListboxOption>
          ))}
          {!filteredOptions.length && (
            <NoOptionsMessage>No Options</NoOptionsMessage>
          )}
        </Menu>
      </InputWrapper>
      <AssistiveText name={name} />
    </div>
  )
}

export default multiInstance({
  name: 'Typeahead',
  actionPattern: 'TYPEAHEAD__',
  dispatchToProps: (dispatch) => ({
    loadOptions: (options) => {
      dispatch({
        type: TYPEAHEAD__LOAD_OPTIONS,
        options,
      })
    },
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
    onOptionToggle: ({ option, isMulti }) => {
      dispatch({
        type: TYPEAHEAD__OPTION_TOGGLE,
        option,
        isMulti,
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
