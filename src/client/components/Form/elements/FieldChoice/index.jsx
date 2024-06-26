import React from 'react'
import PropTypes from 'prop-types'
import MultiChoice from '@govuk-react/multi-choice'
import Checkbox from '@govuk-react/checkbox'
import Radio from '@govuk-react/radio'
import styled from 'styled-components'

import { useField, useFormContext } from '../../hooks'
import FieldWrapper from '../FieldWrapper'

const StyledMultiChoice = styled(MultiChoice)(({ inline }) => ({
  ...(inline
    ? {
        display: 'flex',
        marginRight: '10px',
      }
    : {}),
}))

const isRadio = (type) => type === 'radio'

const getInitialValue = (initialValue, type) => {
  if (initialValue) {
    return initialValue
  }
  return isRadio(type) ? '' : []
}

const FieldChoice = ({
  type,
  name,
  validate,
  required,
  label,
  legend,
  hint,
  inline,
  initialValue,
  options = [],
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
      <StyledMultiChoice meta={{ error, touched }} inline={inline}>
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
      </StyledMultiChoice>
    </FieldWrapper>
  )
}

FieldChoice.Checkbox = (props) => <FieldChoice {...props} type="checkbox" />
FieldChoice.Radio = (props) => <FieldChoice {...props} type="radio" />

FieldChoice.propTypes = {
  type: PropTypes.oneOf(['radio', 'checkbox']).isRequired,
  name: PropTypes.string.isRequired,
  validate: PropTypes.func,
  required: PropTypes.func,
  label: PropTypes.string,
  legend: PropTypes.node,
  hint: PropTypes.string,
  inline: PropTypes.bool,
  initialValue: PropTypes.object,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ).isRequired,
}

export default FieldChoice
