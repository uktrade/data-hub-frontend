import React from 'react'
import PropTypes from 'prop-types'
import MultiChoice from '@govuk-react/multi-choice'
import styled from 'styled-components'
import { WHITE } from 'govuk-colours'

import Checkbox from '../../../Checkbox'
import useField from '../../hooks/useField'
import FieldWrapper from '../FieldWrapper'
import { useFormContext } from '../../hooks'

const StyledDiv = styled('div')`
  ${(props) =>
    props.reduced &&
    `
    background-color: ${WHITE};
    margin: 0 -4px;
    `}
`

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
  reduced,
  reducedPadding,
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
        reduced,
        reducedPadding,
      }}
    >
      <MultiChoice meta={{ error, touched }} reduced={reduced}>
        {options.map(
          ({
            value: optionValue,
            label: optionLabel,
            children,
            ...optionProps
          }) => (
            <StyledDiv key={optionValue} reduced={reduced}>
              <Checkbox
                key={optionValue}
                name={optionValue}
                checked={value.includes(optionValue)}
                onChange={onChange}
                onBlur={onBlur}
                reduced={reduced}
                aria-label={optionLabel}
                {...optionProps}
              >
                {optionLabel}
              </Checkbox>

              {value.includes(optionValue) && !!children ? children : null}
            </StyledDiv>
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
  reduced: PropTypes.bool,
  reducedPadding: PropTypes.bool,
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
  reduced: false,
  reducedPadding: false,
}

export default FieldCheckboxes
