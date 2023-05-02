import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { kebabCase } from 'lodash'

import Input from '@govuk-react/input'
import ErrorText from '@govuk-react/error-text'
import {
  BORDER_WIDTH_FORM_ELEMENT_ERROR,
  SPACING,
} from '@govuk-react/constants'
import { ERROR_COLOUR } from '../../../../../client/utils/colours'

import { useField } from '../../hooks'
import FieldWrapper from '../FieldWrapper'

const StyledInputWrapper = styled('div')`
  ${(props) =>
    props.error &&
    `
    border-left: ${BORDER_WIDTH_FORM_ELEMENT_ERROR} solid ${ERROR_COLOUR};
    margin-right: ${SPACING.SCALE_3};
    padding-left: ${SPACING.SCALE_2};
  `}
  ${Input} {
    height: 47px;
  }
`

const StyledText = styled('span')({
  paddingLeft: SPACING.SCALE_2,
})

/**
 * A basic input field for numbers and text.
 */
const FieldInput = ({
  name,
  type,
  validate,
  required,
  label,
  text,
  legend,
  hint,
  initialValue,
  reduced,
  ...rest
}) => {
  const { value, error, touched, onChange, onBlur } = useField({
    name,
    validate,
    required,
    initialValue,
  })
  return (
    <FieldWrapper {...{ name, label, legend, hint, error, reduced }}>
      <StyledInputWrapper error={error}>
        {touched && error && <ErrorText>{error}</ErrorText>}
        <Input
          key={name}
          error={touched && Boolean(error)}
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          data-test={kebabCase(`${name}-'input'`)}
          {...rest}
        />
        {text && <StyledText>{text}</StyledText>}
      </StyledInputWrapper>
    </FieldWrapper>
  )
}

FieldInput.propTypes = {
  /**
   * Text for name attribute value
   */
  name: PropTypes.string.isRequired,
  /**
   * Text for type attribute value
   */
  type: PropTypes.string.isRequired,
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
   * Sets initial value of the input
   */
  initialValue: PropTypes.string,
  /**
   * Toggles wether the element is a filter or not
   */
  reduced: PropTypes.bool,
}

FieldInput.defaultProps = {
  validate: null,
  required: null,
  label: null,
  legend: null,
  hint: null,
  initialValue: '',
  reduced: false,
}

export default FieldInput
