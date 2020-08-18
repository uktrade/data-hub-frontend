import React from 'react'
import PropTypes from 'prop-types'
import Radio from '@govuk-react/radio'
import MultiChoice from '@govuk-react/multi-choice'
import styled from 'styled-components'

import { useField } from '../../hooks'
import FieldWrapper from '../FieldWrapper'

const StyledChildField = styled('div')`
  margin-left: 55px;
  clear: both;
`

const StyledRadio = styled(Radio)`
  ${(props) =>
    props.inline &&
    `
      float: left;
      clear: none;
    `}
`

const FieldRadios = ({
  name,
  validate,
  required,
  label,
  legend,
  hint,
  inline,
  initialValue,
  options,
}) => {
  const { value, error, touched, onChange, onBlur } = useField({
    name,
    validate,
    required,
    initialValue,
  })

  return (
    <FieldWrapper {...{ name, label, legend, hint, error }}>
      <MultiChoice meta={{ error, touched }}>
        {options.map(
          ({
            label: optionLabel,
            value: optionValue,
            children: optionChildren,
            ...optionProps
          }) => (
            <React.Fragment key={optionValue}>
              <StyledRadio
                inline={inline}
                value={optionValue}
                checked={value === optionValue}
                onChange={onChange}
                onBlur={onBlur}
                name={name}
                {...optionProps}
              >
                {optionLabel}
              </StyledRadio>

              {value === optionValue && optionChildren && (
                <StyledChildField>{optionChildren}</StyledChildField>
              )}
            </React.Fragment>
          )
        )}
      </MultiChoice>
    </FieldWrapper>
  )
}

FieldRadios.propTypes = {
  name: PropTypes.string.isRequired,
  validate: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func),
  ]),
  required: PropTypes.string,
  label: PropTypes.node,
  legend: PropTypes.node,
  hint: PropTypes.node,
  inline: PropTypes.bool,
  initialValue: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      hint: PropTypes.node,
      children: PropTypes.node,
    })
  ),
}

FieldRadios.defaultProps = {
  validate: null,
  required: null,
  label: null,
  legend: null,
  hint: null,
  inline: false,
  initialValue: '',
  options: [],
}

export default FieldRadios
