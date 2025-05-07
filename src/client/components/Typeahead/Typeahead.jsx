import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FOCUSABLE, SPACING } from '@govuk-react/constants'
import InsetText from '@govuk-react/inset-text'
import Label from '@govuk-react/label'

import Metadata from '../../components/Metadata/'
import {
  BLACK,
  BLUE,
  FOCUS_COLOUR,
  GREY_1,
  GREY_2,
  LINK_COLOUR,
  RED,
  TEXT_COLOUR,
  WHITE,
} from '../../utils/colours'
import multiInstance from '../../utils/multiinstance'

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
  TYPEAHEAD__OPTIONS_CLEAR,
  TYPEAHEAD__OPTIONS_LOADED,
} from '../../actions'

import Task from '../Task'
import Highlighter from './Highlighter'
import AssistiveText from './AssistiveText'
import SelectedChips from './SelectedChips'
import {
  getActionFromKey,
  getFilteredOptions,
  getUpdatedIndex,
  menuActions,
  getNewSelectedOptions,
} from './utils'
import reducer from './reducer'
import { TASK_GET_TYPEAHEAD_OPTIONS } from './state'

const ListboxOption = styled('div')((props) => ({
  display: 'flex',
  padding: props.isMulti
    ? `${SPACING.SCALE_3} 0 ${SPACING.SCALE_3} 48px`
    : SPACING.SCALE_3,
  borderBottom: `solid 1px ${GREY_2}`,
  position: 'relative',
  boxSizing: 'border-box',
  minHeight: 53,
  alignItems: 'center',
  cursor: 'pointer',
  backgroundColor: props.active ? BLUE : WHITE,
  color: props.active ? WHITE : TEXT_COLOUR,
  cursor: props.isDisabled ? 'not-allowed' : 'pointer',

  '&:last-child': {
    borderBottom: 'none',
  },
  '::before': {
    content: props.isMulti ? '""' : '',
    position: 'absolute',
    left: 10,
    top: 'calc(50% - 14px)',
    width: 26,
    height: 26,
    backgroundColor: WHITE,
    boxSizing: 'border-box',
    border: `solid 2px ${TEXT_COLOUR}`,
    outline: props.focussed ? `3px solid ${FOCUS_COLOUR}` : 'none',
    outlineOffset: 0,
  },
  '::after': {
    display: props['aria-selected'] ? 'block' : 'none',
    content: props.isMulti ? '""' : '',
    position: 'absolute',
    left: 19,
    top: 'calc(50% - 3px)',
    width: 5,
    height: 14,
    borderRight: `3px solid ${TEXT_COLOUR}`,
    borderBottom: `3px solid ${TEXT_COLOUR}`,
    transform: 'translate(0, -50%) rotate(45deg)',
  },
}))

const StyledInsetText = styled(InsetText)((props) => ({
  '&': {
    marginTop: SPACING.SCALE_1,
    color: props.active ? WHITE : TEXT_COLOUR,
  },
  'div > a': {
    color: props.active ? `${GREY_2} !important` : `${LINK_COLOUR} !important`,
  },
}))

const NoOptionsMessage = styled('div')({
  padding: `${SPACING.SCALE_3} 0`,
  boxSizing: 'border-box',
  minHeight: 53,
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

const AutocompleteInput = styled('input')(({ error }) => ({
  backgroundColor: WHITE,
  boxSizing: 'border-box',
  border: error ? `4px solid ${RED}` : `2px solid ${BLACK}`,
  display: 'block',
  fontSize: '1em',
  padding: '8px 12px 10px',
  textAlign: 'left',
  width: '100%',
  ...FOCUSABLE,
}))

const TypeaheadOptionContent = ({ option, searchString }) => (
  <Highlighter optionLabel={option.label} searchStr={searchString} />
)

const Menu = styled('div')(({ open }) => ({
  visibility: open ? 'visible' : 'hidden',
  backgroundColor: WHITE,
  boxSizing: 'border-box',
  border: `1px solid ${BLACK}`,
  maxHeight: 336,
  overflowY: 'scroll',
  left: 0,
  position: 'absolute',
  top: '100%',
  width: '100%',
  zIndex: 100,
}))

const Typeahead = ({
  id,
  name,
  className,
  label = '',
  labelName,
  error = false,
  closeMenuOnSelect = false,
  isMulti = false,
  noOptionsMessage = 'No Options',
  defaultValue,
  value,
  menuOpen,
  loadOptions,
  initialOptions = [],
  options = [],
  input = '',
  selectedOptions = [],
  placeholder = 'Start typing',
  activeIndex,
  focusIndex,
  onInitialise,
  onBlur,
  onActiveChange,
  onInput,
  onOptionMouseDown,
  onOptionToggle,
  onOptionRemove,
  onOptionsClear,
  onMenuClose,
  onMenuOpen,
  showMetaData = false,
  showInsetText = false,
  onChange = () => {},
  'data-test': testId,
  OptionContent = TypeaheadOptionContent,
  ...inputProps
}) => {
  const closeOnSelect = isMulti ? closeMenuOnSelect : true
  const initialValue = value || defaultValue
  useEffect(() => {
    onInitialise({
      isMulti,
      value: initialValue,
    })
  }, [JSON.stringify(initialValue), isMulti])
  const inputRef = React.useRef(null)
  const listRef = React.useRef(null)
  const ignoreFilter =
    !isMulti && selectedOptions.map(({ label }) => label).includes(input)
  const filteredOptions = getFilteredOptions({
    options,
    input: !ignoreFilter && input,
  })
  const activeId =
    menuOpen && filteredOptions[activeIndex]
      ? `${name}-${filteredOptions[activeIndex].value}`
      : ''
  const scrollItemAtIndexIntoView = (index) => {
    const item = listRef.current?.children[index]
    if (item) {
      item.scrollIntoView({ block: 'nearest' })
    }
  }
  const onInputKeyDown = (event) => {
    const max = filteredOptions.length - 1
    const action = getActionFromKey(event.code, menuOpen)

    switch (action) {
      case menuActions.next:
      case menuActions.last:
      case menuActions.first:
      case menuActions.previous:
        event.preventDefault()
        const newActiveIndex = getUpdatedIndex(activeIndex, max, action)
        onActiveChange(newActiveIndex)
        scrollItemAtIndexIntoView(newActiveIndex)
        return
      case menuActions.closeSelect:
        event.preventDefault()
        if (filteredOptions[activeIndex]) {
          if (filteredOptions[activeIndex].isDisabled) {
            return
          }
          onOptionToggle(filteredOptions[activeIndex])
          onChange(
            getNewSelectedOptions({
              selectedOptions,
              isMulti,
              option: filteredOptions[activeIndex],
            })
          )
        }
        if (closeOnSelect) {
          onMenuClose()
        }
        return
      case menuActions.close:
        event.preventDefault()
        onMenuClose()
        return
      case menuActions.open:
        onMenuOpen()
        scrollItemAtIndexIntoView(activeIndex)
        return
    }
  }

  const menuActive = loadOptions ? !!input : true
  return (
    <div id={`${name}-wrapper`} data-test={testId} className={className}>
      {label && (
        <Label id={`${name}-label`} data-test="typeahead-label" htmlFor={name}>
          {label}
        </Label>
      )}
      {isMulti && Boolean(selectedOptions.length) && (
        <SelectedChips
          name={name}
          label={labelName}
          selectedOptions={selectedOptions}
          onOptionRemove={(option) => {
            onOptionRemove(option)
            onChange(
              selectedOptions.filter(({ value }) => value !== option.value)
            )
          }}
        />
      )}
      <InputWrapper>
        <AutocompleteInput
          {...inputProps}
          id={name}
          name={name}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          inputMode="search"
          aria-activedescendant={activeId}
          aria-autocomplete="list"
          aria-owns={`${name}-listbox`}
          aria-controls={`${name}-listbox`}
          aria-expanded={menuOpen ? 'true' : 'false'}
          aria-haspopup="listbox"
          aria-describedby={`autocomplete-${name}-assistiveHint`}
          role="combobox"
          type="text"
          placeholder={placeholder}
          value={input}
          onBlur={onBlur}
          onClick={() => {
            onMenuOpen()
            scrollItemAtIndexIntoView(activeIndex)
          }}
          onInput={(e) => {
            onInput(e)
            if (!isMulti && !e.target.value) {
              onOptionsClear()
              onChange([])
            }
          }}
          onKeyDown={onInputKeyDown}
          error={error}
          ref={inputRef}
          data-test="typeahead-input"
        />
        <Menu
          id={`${name}-listbox`}
          open={menuOpen && menuActive}
          role="listbox"
          aria-labelledby={`${name}-label`}
          aria-multiselectable="true"
          data-test="typeahead-menu"
        >
          {menuOpen && menuActive && (
            <Task.Status
              name={TASK_GET_TYPEAHEAD_OPTIONS}
              id={id}
              progressMessage="Loading options"
              startOnRender={{
                payload: {
                  options: initialOptions,
                  loadOptions,
                  autocomplete: input,
                },
                onSuccessDispatch: TYPEAHEAD__OPTIONS_LOADED,
              }}
            >
              {() => (
                <div ref={listRef}>
                  {filteredOptions.map((option, index) => (
                    <ListboxOption
                      id={`${name}-${option.value}`}
                      key={option.value}
                      active={index === activeIndex}
                      isDisabled={option.isDisabled}
                      aria-disabled={option.isDisabled}
                      focussed={index === focusIndex}
                      isMulti={isMulti}
                      role="option"
                      aria-selected={
                        selectedOptions
                          .map(({ value }) => value)
                          .indexOf(option.value) > -1
                      }
                      aria-setsize={filteredOptions.length}
                      aria-posinset={index}
                      onClick={() => {
                        if (option.isDisabled) {
                          return
                        }
                        inputRef.current && inputRef.current.select()
                        onOptionToggle(option)
                        onChange(
                          getNewSelectedOptions({
                            selectedOptions,
                            isMulti,
                            option,
                          })
                        )
                        if (closeOnSelect) {
                          onMenuClose()
                        }
                      }}
                      onMouseMove={() => {
                        onActiveChange(index)
                      }}
                      onMouseDown={() => {
                        onOptionMouseDown(index)
                      }}
                      data-test="typeahead-menu-option"
                    >
                      <span>
                        <OptionContent option={option} searchString={input} />
                        {showMetaData && option.meta ? (
                          <Metadata
                            active={index === activeIndex}
                            key={`${label}-${index}`}
                            rows={option.meta}
                          />
                        ) : null}
                        {showInsetText && option.insetText ? (
                          <StyledInsetText
                            data-test="typeahead-inset-text"
                            active={index === activeIndex}
                            key={label}
                          >
                            {option.insetText}
                          </StyledInsetText>
                        ) : null}
                      </span>
                    </ListboxOption>
                  ))}
                  {!filteredOptions.length && (
                    <NoOptionsMessage data-test="typeahead-no-options">
                      {noOptionsMessage}
                    </NoOptionsMessage>
                  )}
                </div>
              )}
            </Task.Status>
          )}
        </Menu>
      </InputWrapper>
      <AssistiveText name={name} />
    </div>
  )
}

const keyPairPropType = PropTypes.shape({
  label: PropTypes.string,
  value: PropTypes.string,
})

Typeahead.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  labelName: PropTypes.string,
  error: PropTypes.string,
  closeMenuOnSelect: PropTypes.bool,
  isMulti: PropTypes.bool,
  // Whether to show extra meta data on each option.
  showMetaData: PropTypes.bool,
  // Whether to show inset text for an option.
  showInsetText: PropTypes.bool,
  noOptionsMessage: PropTypes.string,
  defaultValue: PropTypes.oneOfType([
    keyPairPropType,
    PropTypes.arrayOf(keyPairPropType),
  ]),
  value: PropTypes.oneOfType([
    keyPairPropType,
    PropTypes.arrayOf(keyPairPropType),
  ]),
  menuOpen: PropTypes.bool,
  loadOptions: PropTypes.func,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(keyPairPropType),
  input: PropTypes.string,
  selectedOptions: PropTypes.arrayOf(keyPairPropType),
  activeIndex: PropTypes.number,
  focusIndex: PropTypes.number,
  onInitialise: PropTypes.func,
  onBlur: PropTypes.func,
  onActiveChange: PropTypes.func,
  onInput: PropTypes.func,
  onOptionMouseDown: PropTypes.func,
  onOptionToggle: PropTypes.func,
  onOptionRemove: PropTypes.func,
  onOptionsClear: PropTypes.func,
  onMenuClose: PropTypes.func,
  onMenuOpen: PropTypes.func,
}

export default multiInstance({
  name: 'Typeahead',
  actionPattern: 'TYPEAHEAD__',
  dispatchToProps: (dispatch) => ({
    onInitialise: ({ isMulti, value }) => {
      dispatch({
        type: TYPEAHEAD__INITIALISE,
        isMulti,
        value,
      })
    },
    onBlur: () => {
      dispatch({
        type: TYPEAHEAD__BLUR,
      })
    },
    onActiveChange: (activeIndex) => {
      dispatch({
        type: TYPEAHEAD__SET_ACTIVE_OPTION,
        activeIndex,
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
    onOptionMouseDown: (focusIndex) => {
      dispatch({
        type: TYPEAHEAD__OPTION_MOUSE_DOWN,
        focusIndex,
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
    onOptionsClear: () => {
      dispatch({
        type: TYPEAHEAD__OPTIONS_CLEAR,
      })
    },
  }),
  component: Typeahead,
  reducer,
})
