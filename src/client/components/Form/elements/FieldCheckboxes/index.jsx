import React from 'react'
import PropTypes from 'prop-types'
import MultiChoice from '@govuk-react/multi-choice'

import Checkbox from '../../../Checkbox'
import useField from '../../hooks/useField'
import FieldWrapper from '../FieldWrapper'
import { useFormContext } from '../../hooks'

const FieldCheckboxes = ({
  name,
  validate,
  required,
  label,
  legend,
  bigLegend,
  hint,
  options,
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

  const onChange = (e) => {
    const { name: optionName, checked } = e.target
    let newValue = Array.isArray(value) ? [...value] : []

    if (checked) {
      newValue.push(optionName)
    } else if (newValue.includes(optionName)) {
      newValue = newValue.filter((item) => item !== optionName)
    }

    setFieldValue(name, newValue)
  }

  return (
    <FieldWrapper
      {...{
        ...props,
        name,
        label,
        legend,
        bigLegend,
        hint,
        error,
      }}
    >
      <MultiChoice meta={{ error, touched }}>
        {options.map(
          ({
            value: optionValue,
            label: optionLabel,
            children,
            ...optionProps
          }) => (
            <>
              <Checkbox
                key={optionValue}
                name={optionValue}
                checked={value.includes(optionValue)}
                onChange={onChange}
                onBlur={onBlur}
                aria-label={optionLabel}
                {...optionProps}
              >
                {optionLabel}
              </Checkbox>
              {value.includes(optionValue) && !!children ? children : null}
            </>
          )
        )}
      </MultiChoice>
    </FieldWrapper>
  )
}

FieldCheckboxes.propTypes = {
  name: PropTypes.string.isRequired,
  validate: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func),
  ]),
  required: PropTypes.string,
  label: PropTypes.node,
  legend: PropTypes.node,
  hint: PropTypes.node,
  initialValue: PropTypes.arrayOf(PropTypes.string),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      children: PropTypes.node,
    })
  ),
}

FieldCheckboxes.defaultProps = {
  validate: null,
  required: null,
  label: null,
  legend: null,
  hint: null,
  initialValue: [],
  options: [],
}

export default FieldCheckboxes
