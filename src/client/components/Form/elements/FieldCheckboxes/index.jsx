import React from 'react'
import PropTypes from 'prop-types'
import MultiChoice from '@govuk-react/multi-choice'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'

import Checkbox from '../../../Checkbox'
import useField from '../../hooks/useField'
import FieldWrapper from '../FieldWrapper'
import { useFormContext } from '../../hooks'

const StyledOr = styled('div')({
  paddingLeft: SPACING.SCALE_2,
  paddingRight: SPACING.SCALE_2,
  marginBottom: SPACING.SCALE_2,
})

const FieldCheckboxes = ({
  name,
  validate,
  required,
  label,
  legend,
  bigLegend,
  hint,
  options = [],
  initialValue = [],
  exclusive = false,
  ...props
}) => {
  const { value, error, touched, onBlur } = useField({
    name,
    validate,
    required,
    initialValue,
  })
  const { setFieldValue } = useFormContext()

  const onChange = (event) => {
    if (event.target.checked) {
      setFieldValue(name, [...value, event.target.name])
    } else {
      setFieldValue(
        name,
        value.filter((v) => v !== event.target.name)
      )
    }
  }

  const onChangeExclusive = (event) => {
    if (event.target.checked) {
      const lastOption = options.slice(options.length - 1)[0]
      if (lastOption.value === event.target.name) {
        setFieldValue(name, [event.target.name])
      } else {
        setFieldValue(name, [
          ...value.filter((v) => v !== lastOption.value),
          event.target.name,
        ])
      }
    } else {
      setFieldValue(
        name,
        value.filter((v) => v !== event.target.name)
      )
    }
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
          (
            {
              value: optionValue,
              label: optionLabel,
              children,
              ...optionProps
            },
            index
          ) => (
            <>
              {exclusive && index === options.length - 1 && (
                <StyledOr>or</StyledOr>
              )}
              <Checkbox
                key={optionValue}
                name={optionValue}
                checked={value.includes(optionValue)}
                onChange={exclusive ? onChangeExclusive : onChange}
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
  exclusive: PropTypes.bool,
  initialValue: PropTypes.array,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      children: PropTypes.node,
    })
  ),
}

export default FieldCheckboxes
