import React from 'react'
import PropTypes from 'prop-types'
import Radio from '@govuk-react/radio'
import MultiChoice from '@govuk-react/multi-choice'
import styled from 'styled-components'
import InsetText from '@govuk-react/inset-text'
import { kebabCase } from 'lodash'

import { useField } from '../../hooks'
import FieldWrapper from '../FieldWrapper'

const StyledInsetText = styled(InsetText)`
  border-left: 5px solid #bfc1c3;
  padding-left: 0px;
  margin-left: 17px;
  padding-inline: 1px;
`
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
  options,
  ...props
}) => {
  const { value, error, touched, onChange, onBlur } = useField({
    name,
    validate,
    required,
    initialValue,
  })

  return (
    <FieldWrapper
      {...{ ...props, name, label, legend, hint, error, bigLegend }}
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
                data-test={kebabCase(`${name}-${optionLabel}`)}
                aria-label={optionLabel}
                {...optionProps}
              >
                {optionLabel}
                {optionLink && <>{optionLink}</>}
              </StyledRadio>

              {value === optionValue && optionChildren && (
                <StyledInsetText>
                  <StyledChildField>{optionChildren}</StyledChildField>
                </StyledInsetText>
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
