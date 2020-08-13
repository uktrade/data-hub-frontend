import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { TextAreaField } from '@govuk-react/text-area'
import ErrorText from '@govuk-react/error-text'
import {
  BORDER_WIDTH_FORM_ELEMENT_ERROR,
  SPACING,
} from '@govuk-react/constants'
import { ERROR_COLOUR } from 'govuk-colours'

import useField from '../../hooks/useField'
import FieldWrapper from '../FieldWrapper'

const StyledTextareaWrapper = styled('div')`
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

const FieldTextarea = ({
  name,
  validate,
  required,
  label,
  legend,
  hint,
  initialValue,
  ...rest
}) => {
  const { value, error, touched, onChange, onBlur } = useField({
    name,
    validate,
    required,
    initialValue,
  })

  return (
    <FieldWrapper {...{ name, label, legend, hint, error }}>
      <StyledTextareaWrapper error={error}>
        {touched && error && <ErrorText>{error}</ErrorText>}
        <TextAreaField
          id={name}
          key={name}
          error={touched && error}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          rows="5"
          {...rest}
        />
      </StyledTextareaWrapper>
    </FieldWrapper>
  )
}

FieldTextarea.propTypes = {
  name: PropTypes.string.isRequired,
  validate: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func),
  ]),
  required: PropTypes.string,
  label: PropTypes.node,
  legend: PropTypes.node,
  hint: PropTypes.node,
  initialValue: PropTypes.string,
}

FieldTextarea.defaultProps = {
  validate: null,
  required: null,
  label: null,
  legend: null,
  hint: null,
  initialValue: '',
}

export default FieldTextarea
