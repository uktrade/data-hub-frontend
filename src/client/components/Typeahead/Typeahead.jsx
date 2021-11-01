import React, { useState } from 'react'
import Select from 'react-select'
import { components } from 'react-select'
import AsyncSelect from 'react-select/async'
import styled from 'styled-components'
import defaultStyles, { errorStyles } from './styles'
import Highlighter from './Highlighter'

const {
  Input,
  Option,
  NoOptionsMessage,
  MenuList,
  SelectContainer,
  MultiValueRemove,
  MultiValueLabel,
} = components

export const filterOption = ({ label = '' }, query) =>
  label.toLowerCase().includes(query.toLowerCase())

const StyledListItem = styled('li')`
  div {
    ${({ isSelected }) => isSelected && 'background-color: pink;'}
  }
`

const CustomMultiValue = ({ children, ...props }) => {
  return (
    <ul>
      <CustomMultiValueLabel {...props}>{children}</CustomMultiValueLabel>
      <MultiValueRemove />
    </ul>
  )
}

const CustomMultiValueLabel = () => {
  return (
    <li>
      {children}
      {/* <MultiValueRemove {...props} /> */}
    </li>
  )
}

const CustomOption = ({
  selectProps: { inputValue, onClick },
  data: { label },
  ariaProps,
  isSelected,
  id,
  ...props
}) => (
  <StyledListItem
    {...ariaProps}
    id={id}
    isSelected={isSelected}
    onClick={onClick}
  >
    <Option {...props}>
      <Highlighter searchStr={inputValue} optionLabel={label} />
    </Option>
  </StyledListItem>
)

const CustomNoOptionsMessage = ({ children, ...props }) => (
  <li>
    <NoOptionsMessage {...props}>{children}</NoOptionsMessage>
  </li>
)

const CustomMenuList = ({ children, selectProps, ...props }) => (
  <MenuList {...props}>
    <ul id={selectProps['data-aria-id']} role="listbox">
      {Array.isArray(children)
        ? children.map((child, i) => {
            //  child.props.isSelected && console.log(child.props.data.label)
            return React.cloneElement(child, {
              ariaProps: {
                role: 'option',
                'aria-selected': child.props.isSelected,
                'aria-setsize': children.length,
                'aria-posinset': i + 1,
              },
              isSelected: child.props.isSelected,
              id: `combo-option-${i + 1}`,
            })
          })
        : Boolean(!!selectProps.inputValue.length) && children}
    </ul>
  </MenuList>
)

const CustomInput = ({
  children,
  selectProps,
  inputProps,
  activeDescendant,
  ...props
}) => (
  <>
    <Input
      {...props}
      aria-owns={selectProps['data-aria-id']}
      aria-autocomplete="list"
      aria-expanded={selectProps.menuIsOpen}
      aria-describedby={`${selectProps['data-aria-id']}-assistiveHint`}
      aria-activedescendant={selectProps.activeDescendant}
      role="combobox"
    />
    {Boolean(!selectProps.options.length) && (
      <ul
        id={selectProps['data-aria-id']}
        role="listbox"
        style={{ display: 'none' }}
      ></ul>
    )}
  </>
)

const AssistiveText = ({ name }) => (
  <span id={`autocomplete-${name}-assistiveHint`} style={{ display: 'none' }}>
    When autocomplete results are available use up and down arrows to review and
    enter to select.
  </span>
)

const CustomSelectContainer = ({
  children,
  className,
  innerProps,
  isFocused,
  ...commonProps
}) => (
  <SelectContainer
    className={className}
    innerProps={innerProps}
    isFocused={isFocused}
    {...commonProps}
  >
    {children}
  </SelectContainer>
)

const Typeahead = ({ value, options, styles, error, name, ...props }) => {
  const [activeDescendant, setActiveDescendant] = useState('')
  const handleOnClick = (e) => {
    setActiveDescendant(e.currentTarget.getAttribute('id'))
  }

  const customisedProps = {
    styles: {
      ...(error ? errorStyles : defaultStyles),
      ...styles,
    },
    components: {
      Option: CustomOption,
      MenuList: CustomMenuList,
      Input: CustomInput,
      NoOptionsMessage: CustomNoOptionsMessage,
      SelectContainer: CustomSelectContainer,
      MultiValue: CustomMultiValue,
      MultiValueLabel: CustomMultiValueLabel,
    },
    menuIsOpen: true,
    hideSelectedOptions: false,
    filterOption,
    'data-aria-id': `autocomplete-${name}`,
    inputId: name,
    activeDescendant,
    ...props,
  }

  return (
    <>
      {options ? (
        <Select
          {...customisedProps}
          options={options}
          onClick={handleOnClick}
        />
      ) : (
        <AsyncSelect {...customisedProps} />
      )}
      <AssistiveText name={name} />
    </>
  )
}

Typeahead.propTypes = Select.propTypes

export default Typeahead
