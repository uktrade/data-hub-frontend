import React from 'react'
import Select from 'react-select'
import { components } from 'react-select'
import AsyncSelect from 'react-select/async'
import defaultStyles, { errorStyles } from './styles'
import Highlighter from './Highlighter'

const {
  Input,
  Option,
  NoOptionsMessage,
  MenuList,
  MultiValue,
  Control,
  MultiValueContainer,
  MultiValueLabel,
  MultiValueRemove,
  ValueContainer,
  IndicatorsContainer,
} = components
//  grabs these components from react select. We then make our own and sent them to the react-select
// component to customise it.

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

const CustomControl = ({ selectProps: { value }, children, ...props }) => {
  return (
    <div id="Divvy1">
      <div id="Divvy2">
        {value[0] && (
          <>
            {value.map((selection) => (
              <MultiValue
                components={{
                  Container: MultiValueContainer,
                  Label: MultiValueLabel,
                  Remove: MultiValueRemove,
                }}
                {...props}
              >
                {selection.label}
              </MultiValue>
            ))}
          </>
        )}
      </div>

      <Control
        components={{
          ValueContainer: ValueContainer,
          IndicatorsContainer: IndicatorsContainer,
        }}
        {...props}
      ></Control>
    </div>
  )
}

const CustomNoOptionsMessage = ({ children, ...props }) => (
  <li>
    <NoOptionsMessage {...props}>{children}</NoOptionsMessage>
  </li>
)

const CustomMenuList = ({ children, selectProps, ...props }) => (
  <MenuList {...props}>
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
        : Boolean(!!selectProps.inputValue.length) && children}
    </ul>
  </MenuList>
)

const CustomInput = ({ children, selectProps, inputProps, ...props }) => (
  <>
    <div className="react-select-container">
      <div className="react-select__control">
        <div className="react-select__value-container">
          <Input
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
        </div>
      </div>
    </div>
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
      //  SLAP THE MULTI THING HERE LIKE THESE!!
      Control: CustomControl,
    },
    filterOption,
    'data-aria-id': `autocomplete-${name}`,
    inputId: name,
    ...props,
  }

  return (
    <>
      {options ? (
        <Select {...customisedProps} options={options} />
      ) : (
        <AsyncSelect {...customisedProps} />
      )}
      <AssistiveText name={name} />
    </>
  )
}
//  Here we create a customised props object that lets you swap in your personalised components to the
//  react select's component. The typeahead is just a personalised select from this library.

Typeahead.propTypes = Select.propTypes

export default Typeahead
