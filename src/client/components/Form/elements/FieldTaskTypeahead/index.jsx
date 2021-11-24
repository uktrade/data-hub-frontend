import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ErrorText from '@govuk-react/error-text'
import {
  BORDER_WIDTH_FORM_ELEMENT_ERROR,
  SPACING,
} from '@govuk-react/constants'
import { ERROR_COLOUR } from 'govuk-colours'

import { useField, useFormContext } from '../../hooks'
import FieldWrapper from '../FieldWrapper'
import TaskTypeahead from '../../../Task/Typeahead'

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

const FieldTaskTypeahead = ({
  name,
  validate,
  required,
  label,
  legend,
  hint,
  initialValue,
  ...props
}) => {
  const { value, error, touched, onBlur } = useField({
    name,
    validate,
    required,
    initialValue,
  })

  const { setFieldValue } = useFormContext()

  return (
    <FieldWrapper {...{ name, label, legend, hint, error }}>
      <StyledWrapper error={error}>
        {touched && error && <ErrorText>{error}</ErrorText>}
        <TaskTypeahead
          aria-label={label || legend}
          onBlur={onBlur}
          onChange={(newValue) => setFieldValue(name, newValue)}
          error={error}
          value={value}
          defaultValues={initialValue}
          {...props}
        />
      </StyledWrapper>
    </FieldWrapper>
  )
}

FieldTaskTypeahead.propTypes = {
  ...TaskTypeahead.propTypes,
  name: PropTypes.string.isRequired,
  validate: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func),
  ]),
  required: PropTypes.string,
  label: PropTypes.node,
  legend: PropTypes.node,
  hint: PropTypes.string,
  initialValue: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object),
  ]),
}

export default FieldTaskTypeahead
