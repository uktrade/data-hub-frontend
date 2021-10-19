import React from 'react'
import Select from 'react-select'
import { components } from 'react-select'
import AsyncSelect from 'react-select/async'
import defaultStyles, { errorStyles } from './styles'
import Highlighter from './Highlighter'

const { Input, Option, NoOptionsMessage, MenuList, Control } = components

export const filterOption = ({ label = '' }, query) =>
  label.toLowerCase().includes(query.toLowerCase())

const CustomOption = ({
  selectProps: { inputValue },
  data: { label },
  ariaProps,
  ...props
}) => (
  <li {...ariaProps}>
    <Option {...props}>
      <Highlighter searchStr={inputValue} optionLabel={label} />
    </Option>
  </li>
)

const CustomNoOptionsMessage = ({ children, ...props }) => (
  <li>
    <NoOptionsMessage {...props}>{children}</NoOptionsMessage>
  </li>
)
// figure out which aria tag is causing the screen reader to break on option read out
const CustomControl = ({ children, innerProps, selectProps, ...props }) => {
  innerProps['aria-owns'] = selectProps['data-aria-id']
  innerProps['aria-expanded'] = selectProps.menuIsOpen
  // innerProps.role = 'combobox'
  // innerProps['aria-haspopup'] = 'listbox'
  return (
    <Control {...props} innerProps={innerProps}>
      {children}
    </Control>
  )
}

const CustomMenuList = ({ children, selectProps, ...props }) => (
  <MenuList {...props}>
    <ul
      id={selectProps['data-aria-id']}
      role="listbox"
      aria-multiselectable={selectProps.isMulti}
    >
      {Array.isArray(children)
        ? children.map((child, i) =>
            React.cloneElement(child, {
              ariaProps: {
                role: 'option',
                'aria-selected': child.props.isFocused,
                'aria-setsize': children.length,
                'aria-posinset': i + 1,
              },
            })
          )
        : Boolean(!!selectProps.inputValue.length) && children}
    </ul>
  </MenuList>
)

const CustomInput = ({ children, selectProps, inputProps, ...props }) => (
  <>
    <Input
      {...props}
      aria-activedescendant=""
      aria-autocomplete="list"
      aria-describedby={`${selectProps['data-aria-id']}-assistiveHint`}
      type="text"
      id="Input"
    />
  </>
)

const AssistiveText = ({ name }) => (
  <span id={`autocomplete-${name}-assistiveHint`} style={{ display: 'none' }}>
    When autocomplete results are available use up and down arrows to review and
    enter to select.
  </span>
)

const Typeahead = ({ options, styles, error, name, ...props }) => {
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
      Control: CustomControl,
    },
    filterOption,
    'data-aria-id': `autocomplete-${name}`,
    inputId: name,
    ...props,
  }

  return (
    <>
      {/* <span id="LaurenId-remove" style={{ display: 'none' }}>
        remove
      </span> */}

      {options ? (
        <Select {...customisedProps} options={options} />
      ) : (
        <AsyncSelect {...customisedProps} />
      )}
      <AssistiveText name={name} />
    </>
  )
}

Typeahead.propTypes = Select.propTypes

export default Typeahead
