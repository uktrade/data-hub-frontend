import React from 'react'
import Select from 'react-select'
import { components } from 'react-select'
import AsyncSelect from 'react-select/async'
import defaultStyles, { errorStyles } from './styles'
import Highlighter from './Highlighter'

const { Input, Option, NoOptionsMessage, MenuList, SelectContainer } =
  components

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
  </>
)

const AssistiveText = ({ name }) => (
  <span id={`autocomplete-${name}-assistiveHint`} style={{ display: 'none' }}>
    When autocomplete results are available use up and down arrows to review and
    enter to select.
  </span>
)

const SelectedValuesContainer = ({ isDisabled, getValue, ...props }) => {
  const { getOptionValue, formatOptionLabel, removeValue } = props.selectProps

  const getValueLabel = (opt) => formatOptionLabel?.(opt, 'value') || opt.label
  const getKey = (opt, index) => `${getOptionValue(opt)}-${index}`

  const toMultiValue = (opt, index) => (
    <components.MultiValue
      getValue={getValue}
      {...props}
      components={{
        Container: components.MultiValueContainer,
        Label: components.MultiValueLabel,
        Remove: components.MultiValueRemove,
      }}
      //isFocused={isOptionFocused}
      isDisabled={isDisabled}
      key={getKey(opt, index)}
      index={index}
      removeProps={{
        onClick: () => removeValue(opt),
        onTouchEnd: () => removeValue(opt),
        onMouseDown: (e) => {
          e.preventDefault()
          e.stopPropagation()
        },
      }}
      data={opt}
    >
      {getValueLabel(opt)}
    </components.MultiValue>
  )

  return (
    <div style={{ margin: '.5rem 0', display: 'flex', flexFlow: 'row wrap' }}>
      {getValue().map(toMultiValue)}
    </div>
  )
}

const CustomSelectContainer = ({
  children,
  className,
  innerProps,
  isFocused,
  ...commonProps
}) => {
  const selectContainerProps = {
    ...commonProps,
  }

  return (
    <SelectContainer
      className={className}
      innerProps={innerProps}
      isFocused={isFocused}
      {...selectContainerProps}
    >
      <SelectedValuesContainer {...commonProps} />
      {children}
    </SelectContainer>
  )
}

const Typeahead = ({ value, options, styles, error, name, ...props }) => {
  // const [setValue] = useState()
  // const onChange = useCallback((newValue) => setValue(newValue), [])
  // const removeValue = useCallback(
  //   (removed) => setValue(value.filter((v) => v.value !== removed.value)),
  //   [value]
  // )
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
    },
    filterOption,
    'data-aria-id': `autocomplete-${name}`,
    inputId: name,
    ...props,
  }

  return (
    <>
      {options ? (
        <Select
          {...customisedProps}
          options={options}
          // onChange={onChange}
          // removeValue={removeValue}
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
