import React from 'react'
import PropTypes from 'prop-types'
import Select, { SelectInput } from '@govuk-react/select'
import styled from 'styled-components'
import { BREAKPOINTS } from '@govuk-react/constants'

import { useField } from '../../hooks'
import FieldWrapper from '../FieldWrapper'
import { BLACK } from '../../../../utils/colours'

const StyledSelect = styled(Select)`
  position: relative;
  &::after {
    border-bottom: 2px solid ${BLACK};
    border-right: 2px solid ${BLACK};
    content: '';
    display: block;
    height: 12px;
    pointer-events: none;
    position: absolute;
    right: 16px;
    ${({ fullWidth }) => (fullWidth ? `right: 2%;` : `right: 52%;`)}
    ${({ meta }) => (meta.error ? 'top: 72%;' : 'top: 50%;')}

    transform: translate(0, -65%) rotate(45deg);
    width: 12px;
    @media (max-width: ${BREAKPOINTS.TABLET}) {
      right: 4%;
    }
  }
  ${SelectInput} {
    height: 47px;
    padding: 0px 32px 0px 12px;
    ${({ fullWidth }) => fullWidth && `width: 100%;`}
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }
`

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
  options = [],
  emptyOption = 'Please select',
  fullWidth,
  boldLabel = true,
  ...rest
}) => {
  const { error, touched, value, onChange, onBlur } = useField({
    name,
    validate,
    required,
    initialValue,
  })
  return (
    <FieldWrapper {...{ name, label, legend, hint, error, boldLabel }}>
      <StyledSelect
        fullWidth={fullWidth}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        meta={{ error, touched }}
        key={Array.isArray(options) && options.length > 0 ? value : undefined}
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
      </StyledSelect>
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
  /***
   * Always render this select component in 100% width, the default is 50%
   */
  fullWidth: PropTypes.bool,
  /**
   * Boolean for rendering the label in bold or not
   */
  boldLabel: PropTypes.bool,
}

export default FieldSelect
