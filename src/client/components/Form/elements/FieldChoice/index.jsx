import React from 'react'
import PropTypes from 'prop-types'
import MultiChoice from '@govuk-react/multi-choice'
import Checkbox from '@govuk-react/checkbox'
import Radio from '@govuk-react/radio'

import { useField, useFormContext } from '../../hooks'
import FieldWrapper from '../FieldWrapper'

const isRadio = (type) => type === 'radio'

const getInitialValue = (initialValue, type) => {
  if (initialValue) {
    return initialValue
  }
  return isRadio(type) ? '' : []
}

const FieldChoice = ({
  name,
  type,
  options = [],
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
    initialValue: getInitialValue(initialValue, type),
  })

  const { setFieldValue } = useFormContext()

  const onChange = (option, type) => {
    if (isRadio(type)) {
      setFieldValue(name, option)
    } else {
      // Checkbox
      setFieldValue(
        name,
        value.includes(option)
          ? value.filter((v) => v !== option)
          : [...value, option]
      )
    }
  }

  const checked = (option) =>
    isRadio(type) ? value === option : value.includes(option)

  const Component = isRadio(type) ? Radio : Checkbox

  return (
    <FieldWrapper {...{ ...props, name, label, legend, hint, error }}>
      <MultiChoice meta={{ error, touched }}>
        {options.map((option) => (
          <React.Fragment key={option.value}>
            <Component
              key={option.id}
              value={option.value}
              checked={checked(option, type)}
              onChange={() => onChange(option, type)}
              onBlur={onBlur}
              name={name}
              aria-label={option.label}
            >
              {option.label}
            </Component>
          </React.Fragment>
        ))}
      </MultiChoice>
    </FieldWrapper>
  )
}

FieldChoice.Checkbox = (props) => <FieldChoice {...props} type="checkbox" />
FieldChoice.Radio = (props) => <FieldChoice {...props} type="radio" />

FieldChoice.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['radio', 'checkbox']).isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ).isRequired,
  validate: PropTypes.func,
  required: PropTypes.string,
  label: PropTypes.string,
  legend: PropTypes.node,
  hint: PropTypes.string,
  inline: PropTypes.bool,
  initialValue: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  }),
}

export default FieldChoice
