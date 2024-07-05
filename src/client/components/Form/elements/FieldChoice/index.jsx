import React from 'react'
import PropTypes from 'prop-types'
import MultiChoice from '@govuk-react/multi-choice'
import Checkbox from '@govuk-react/checkbox'
import Radio from '@govuk-react/radio'
import { isArray, isEqual } from 'lodash'

import { useField, useFormContext } from '../../hooks'
import FieldWrapper from '../FieldWrapper'

const RADIO = 'radio'

const isRadio = (type) => type === RADIO

const FieldChoice = ({
  name,
  type,
  options = [],
  validate,
  required,
  label,
  legend,
  hint,
  ...props
}) => {
  const { value, error, touched, onBlur } = useField({
    name,
    validate,
    required,
  })

  const { setFieldValue } = useFormContext()

  const onChange = (event, option) =>
    setFieldValue(
      name,
      isRadio(type)
        ? option
        : event.target.checked
          ? [...value, option]
          : value.filter((v) => v.value !== event.target.value)
    )

  const isChecked = (option) =>
    isArray(value)
      ? value.some((v) => v.value === option.value) // Checkbox
      : isEqual(value, option) // Radio

  const Component = isRadio(type) ? Radio : Checkbox

  return (
    <FieldWrapper {...{ ...props, name, label, legend, hint, error }}>
      <MultiChoice meta={{ error, touched }}>
        {options.map((option) => (
          <React.Fragment key={option.value}>
            <Component
              key={option.id}
              value={option.value}
              checked={isChecked(option)}
              onChange={(event) => onChange(event, option)}
              onBlur={onBlur}
              name={option.value}
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
}

export default FieldChoice
