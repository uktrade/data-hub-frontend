import React from 'react'
import PropTypes from 'prop-types'
import Radio from '@govuk-react/radio'
import MultiChoice from '@govuk-react/multi-choice'
import styled from 'styled-components'
import { kebabCase } from 'lodash'

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
  bigLegend,
  hint,
  inline,
  initialValue,
  options = [],
  ...props
}) => {
  const { value, error, touched, onChange, onBlur } = useField({
    name,
    validate,
    required,
    initialValue,
  })

  const getDataTest = (prefix, name, optionLabel) => {
    const dataTest = kebabCase(`${name}-${optionLabel}`)
    return prefix ? `${prefix}-${dataTest}` : dataTest
  }

  return (
    <FieldWrapper
      {...{ ...props, name, label, legend, hint, error, bigLegend }}
      data-component="FieldRadios"
    >
      <MultiChoice meta={{ error, touched }}>
        {options.map(
          ({
            label: optionLabel,
            value: optionValue,
            children: optionChildren,
            link: optionLink,
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
                data-test={getDataTest(props.dataTestPrefix, name, optionLabel)}
                aria-label={optionLabel}
                {...optionProps}
              >
                {optionLabel}
                {optionLink && <>{optionLink}</>}
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

export default FieldRadios
