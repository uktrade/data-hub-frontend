import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import Input from '@govuk-react/input'

import FieldWrapper from '../Form/elements/FieldWrapper'

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
  type = 'date',
  ...props
}) => {
  const [value, setValue] = useState(initialValue)
  useEffect(() => setValue(initialValue), [initialValue])

  return (
    <FieldWrapper {...{ name, label, legend, hint }} {...props}>
      <Input
        id={`field-${name}-1`}
        key={name}
        name={name}
        value={value}
        max="9999-12-31"
        aria-label={label}
        type={type}
        onChange={(e) => {
          setValue(e.target.value)
          onChange(e)
        }}
      />
    </FieldWrapper>
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
