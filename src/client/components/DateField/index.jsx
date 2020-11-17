import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { ERROR_COLOUR } from 'govuk-colours'
import {
  BORDER_WIDTH_FORM_ELEMENT_ERROR,
  FONT_WEIGHTS,
  SPACING,
} from '@govuk-react/constants'
import ErrorText from '@govuk-react/error-text'
import Input from '@govuk-react/input'

import FieldWrapper from '../Form/elements/FieldWrapper'

const StyledInputWrapper = styled('div')`
  ${(props) =>
    props.error &&
    `
    border-left: ${BORDER_WIDTH_FORM_ELEMENT_ERROR} solid ${ERROR_COLOUR};
    margin-right: ${SPACING.SCALE_3};
    padding-left: ${SPACING.SCALE_2};
  `}
`

const StyledFieldWrapper = styled(FieldWrapper)`
  label {
    font-weight: ${FONT_WEIGHTS.regular};
  }
`

const DateField = ({ ...props }) => {
  const { error, onChange, name, label, legend, hint, initialValue } = props
  return (
    <StyledFieldWrapper {...{ name, label, legend, hint, error }}>
      <StyledInputWrapper error={error}>
        {error && <ErrorText>{error}</ErrorText>}
        <Input
          id={name}
          name={name}
          error={error}
          defaultValue={initialValue}
          type="date"
          onChange={(e) => onChange(e)}
        />
      </StyledInputWrapper>
    </StyledFieldWrapper>
  )
}

DateField.propTypes = {
  onChange: PropTypes.func,
  name: PropTypes.string.isRequired,
  label: PropTypes.node,
  legend: PropTypes.node,
  hint: PropTypes.string,
  initialValue: PropTypes.string,
}

DateField.defaultProps = {
  onChange: () => {},
}

export default DateField
