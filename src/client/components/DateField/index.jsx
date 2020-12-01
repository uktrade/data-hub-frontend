import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { FONT_WEIGHTS } from '@govuk-react/constants'
import Input from '@govuk-react/input'

import FieldWrapper from '../Form/elements/FieldWrapper'

const StyledFieldWrapper = styled(FieldWrapper)`
  label {
    font-weight: ${FONT_WEIGHTS.regular};
  }
`

/**
 * A Date Input Field
 *
 * Changing the initialValue prop overrides the user's input value - this
 * means that the input value will stay synchronised when changing the route.
 */
const DateField = ({
  onChange = () => {},
  name,
  label,
  legend,
  hint,
  initialValue,
}) => {
  const [value, setValue] = useState(initialValue)
  useEffect(() => setValue(initialValue), [initialValue])

  return (
    <StyledFieldWrapper {...{ name, label, legend, hint }}>
      <Input
        id={name}
        key={name}
        name={name}
        value={value}
        type="date"
        onChange={(e) => {
          setValue(e.target.value)
          onChange(e)
        }}
      />
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

export default DateField
