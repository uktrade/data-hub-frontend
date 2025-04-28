import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ErrorText from '@govuk-react/error-text'
import {
  BORDER_WIDTH_FORM_ELEMENT_ERROR,
  SPACING,
} from '@govuk-react/constants'

import { ERROR_COLOUR } from '../../../../../client/utils/colours'
import { useField, useFormContext } from '../../hooks'
import FieldWrapper from '../FieldWrapper'
import Typeahead from '../../../Typeahead'

const StyledWrapper = styled('div')`
  ${(props) =>
    props.error &&
    `
    border-left: ${BORDER_WIDTH_FORM_ELEMENT_ERROR} solid ${ERROR_COLOUR};
    margin-right: ${SPACING.SCALE_3};
    padding-left: ${SPACING.SCALE_2};
  `}
  textarea {
    width: 100%;
  }
`

/**
 * A Typeahead for use in forms.
 *
 * This is a wrapper around the `react-select` by Jed Watson, for indepth documention refer to [Github](https://github.com/JedWatson/react-select) or the [api docs](https://react-select.com/home)
 */
const FieldTypeahead = ({
  name,
  validate,
  required,
  label,
  legend,
  hint,
  initialValue = null,
  options,
  autoScroll,
  className,
  onChange,
  ...props
}) => {
  const { value, error, touched, onBlur } = useField({
    name,
    validate,
    required,
    initialValue,
  })

  const { setFieldValue } = useFormContext()
  const handleChange = (newValue) => {
    setFieldValue(name, props.isMulti ? newValue : newValue[0])
    if (onChange) {
      onChange(newValue)
    }
  }

  return (
    <FieldWrapper
      {...{ name, label, legend, hint, error, autoScroll, className }}
    >
      <StyledWrapper error={error}>
        {touched && error && <ErrorText>{error}</ErrorText>}
        <Typeahead
          name={name}
          labelName={label}
          aria-label={label || legend}
          onBlur={onBlur}
          onChange={handleChange}
          error={error}
          value={value}
          initialOptions={options}
          {...props}
        />
      </StyledWrapper>
    </FieldWrapper>
  )
}

FieldTypeahead.propTypes = {
  ...Typeahead.propTypes,
  /**
   * Text for name attribute value
   */
  name: PropTypes.string.isRequired,
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
   * Text for the label element
   */
  labelName: PropTypes.string,
  /**
   * for internal accessibility labels
   */
  label: PropTypes.node,
  /**
   * Node for legend element
   */
  legend: PropTypes.node,
  /**
   * Node for hint element
   */
  hint: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /**
   * Sets initial value of the input
   */
  initialValue: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object),
  ]),
  /**
   * Whether the window should auto scroll into view this component
   */
  autoScroll: PropTypes.bool,
  onChange: PropTypes.func,
}

export default FieldTypeahead
