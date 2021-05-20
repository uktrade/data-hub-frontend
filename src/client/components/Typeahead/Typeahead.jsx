import React from 'react'
import Select, { components as comps } from 'react-select'
import AsyncSelect from 'react-select/async'
import defaultStyles, { errorStyles } from './styles'
import Highlighter from './Highlighter'

export const filterOption = ({ label = '' }, query) =>
  label.toLowerCase().includes(query.toLowerCase())

const Option = ({
  selectProps: { inputValue },
  data: { label },
  ariaProps,
  ...props
}) => (
  <li {...ariaProps}>
    <comps.Option {...props}>
      <Highlighter searchStr={inputValue} optionLabel={label} />
    </comps.Option>
  </li>
)

const NoOptionsMessage = ({ children, ...props }) => (
  <li>
    <comps.NoOptionsMessage {...props}>{children}</comps.NoOptionsMessage>
  </li>
)

const MenuList = ({ children, selectProps, ...props }) => (
  <comps.MenuList {...props}>
    <ul id={selectProps['data-aria-id']} role="listbox">
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
        : children}
    </ul>
  </comps.MenuList>
)

const Input = ({ children, selectProps, inputProps, ...props }) => (
  <>
    <comps.Input
      {...props}
      aria-owns={selectProps['data-aria-id']}
      aria-autocomplete="list"
      aria-expanded={selectProps.menuIsOpen}
      aria-describedby={`${selectProps['data-aria-id']}-assistiveHint`}
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

const Typeahead = ({ options, styles, error, name, ...props }) => {
  const customisedProps = {
    styles: {
      ...(error ? errorStyles : defaultStyles),
      ...styles,
    },
    components: { Option, MenuList, Input, NoOptionsMessage },
    filterOption,
    'data-aria-id': `autocomplete-${name}`,
    inputId: name,
    ...props,
  }

  return (
    <>
      {options ? (
        <>
          <Select {...customisedProps} options={options} />
          <AssistiveText name={name} />
        </>
      ) : (
        <>
          <AsyncSelect {...customisedProps} />
          <AssistiveText name={name} />
        </>
      )}
    </>
  )
}

Typeahead.propTypes = Select.propTypes
Option.propTypes = comps.Option.propTypes
MenuList.propTypes = comps.MenuList.propTypes
Input.propTypes = comps.Input.propTypes

export default Typeahead
