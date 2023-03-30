import React from 'react'
import PropTypes from 'prop-types'
import Select from '@govuk-react/select'
import { useField } from '../../hooks'
import FieldWrapper from '../FieldWrapper'

/**
 * A Select dropdown field for use in forms.
 */
const FieldSelect = ({
  name,
  label,
  legend,
  hint,
  validate,
  required,
  initialValue,
  options,
  emptyOption,
  ...rest
}) => {
  const { error, touched, value, onChange, onBlur } = useField({
    name,
    validate,
    required,
    initialValue,
  })
  return (
    <FieldWrapper {...{ name, label, legend, hint, error }}>
      <Select
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        meta={{ error, touched }}
        key={options.length > 0 ? value : undefined}
        input={{
          id: name,
          defaultValue: value,
          ...rest,
        }}
      >
        {emptyOption && (
          <option key="" value="">
            {emptyOption}
          </option>
        )}
        {options.map(({ label: optionLabel, value: optionValue }) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </Select>
      {options.find((o) => o.value === value)?.children}
    </FieldWrapper>
  )
}

FieldSelect.propTypes = {
  /**
   * Text for name attribute value
   */
  name: PropTypes.string.isRequired,
  /**
   * Text for the label element
   */
  label: PropTypes.node,
  /**
   * Node for legend element
   */
  legend: PropTypes.node,
  /**
   * Node for hint element
   */
  hint: PropTypes.node,
  /**
   * Validate functions for input
   */
  validate: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func),
  ]),
  /**
   * Text 'required' sets wether the input is required or not
   */
  required: PropTypes.string,
  /**
   * Sets initial value of the input
   */
  initialValue: PropTypes.string,
  /**
   * Items for the list
   */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  /**
   * Text to display when no items are selected
   */
  emptyOption: PropTypes.string,
}

FieldSelect.defaultProps = {
  validate: null,
  required: null,
  label: null,
  legend: null,
  hint: null,
  initialValue: '',
  options: [],
  emptyOption: 'Please select',
}

export default FieldSelect
