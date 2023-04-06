import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { kebabCase } from 'lodash'

import Input from '@govuk-react/input'
import ErrorText from '@govuk-react/error-text'
import {
  BORDER_WIDTH_FORM_ELEMENT_ERROR,
  BORDER_WIDTH,
  BORDER_WIDTH_FORM_ELEMENT,
  SPACING,
  BREAKPOINTS,
  FONT_SIZE,
} from '@govuk-react/constants'
import {
  ERROR_COLOUR,
  BLACK,
  LIGHT_GREY,
} from '../../../../../client/utils/colours'

import { useField } from '../../hooks'
import FieldWrapper from '../FieldWrapper'
import { number } from '../../../../../client/components/Form/validators'

const StyledInputWrapper = styled('div')`
  ${(props) =>
    props.error &&
    `
    border-left: ${BORDER_WIDTH_FORM_ELEMENT_ERROR} solid ${ERROR_COLOUR};
    margin-right: ${SPACING.SCALE_3};
    padding-left: ${SPACING.SCALE_2};
  `}
`

const StyledText = styled('span')({
  paddingLeft: SPACING.SCALE_2,
})

const StyledCurrencyPrefix = styled('div')`
  border: ${BORDER_WIDTH_FORM_ELEMENT} solid ${BLACK};
  border-right: 0px;
  display: inline-block;
  height: 40px;
  padding: ${BORDER_WIDTH};
  min-width: 40px;
  box-sizing: border-box;
  text-align: center;
  flex: 0 0 auto;
  cursor: default;
  font-size: ${FONT_SIZE.SIZE_19};
  background-color: ${LIGHT_GREY};

  @media (max-width: ${BREAKPOINTS.TABLET}) {
    line-height: 1.6;
    font-size: ${FONT_SIZE.SIZE_16};
  }
  ${(props) =>
    props.error &&
    `
    border: ${BORDER_WIDTH_FORM_ELEMENT_ERROR} solid ${ERROR_COLOUR};
    border-right: 0px;
    `}
`

const StyledCurrencyWrapper = styled('div')`
  display: flex;
`

/**
 * A basic currency field for numbers.
 */
const FieldCurrency = ({
  name,
  validate,
  required,
  label,
  text,
  legend,
  hint,
  initialValue,
  reduced,
  boldLabel,
  currencySymbol = '£',
  ...rest
}) => {
  const { value, error, touched, onChange, onBlur } = useField({
    name,
    validate,
    required,
    initialValue,
  })
  return (
    <FieldWrapper {...{ name, label, legend, hint, error, reduced, boldLabel }}>
      <StyledInputWrapper error={error}>
        {touched && error && <ErrorText>{error}</ErrorText>}
        <StyledCurrencyWrapper>
          <StyledCurrencyPrefix
            error={touched && Boolean(error)}
            aria-hidden="true"
          >
            {currencySymbol}
          </StyledCurrencyPrefix>
          <Input
            key={name}
            error={touched && Boolean(error)}
            id={name}
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            data-test={kebabCase(`${name}-'input'`)}
            {...rest}
          />
        </StyledCurrencyWrapper>
        {text && <StyledText>{text}</StyledText>}
      </StyledInputWrapper>
    </FieldWrapper>
  )
}

FieldCurrency.propTypes = {
  /**
   * Text for name attribute value
   */
  name: PropTypes.string.isRequired,
  /**
   * Validate functions for input
   */
  validate: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func),
  ]),
  /**
   * Text 'required' sets wether the input is required or not
   */
  required: PropTypes.string,
  /**
   * Text for the label element
   */
  label: PropTypes.node,
  /**
   * Node for legend element
   */
  legend: PropTypes.node,
  /**
   * Node for hint element
   */
  hint: PropTypes.node,
  /**
   * Sets initial value of the input
   */
  initialValue: PropTypes.string,
  /**
   * Toggles wether the element is a filter or not
   */
  reduced: PropTypes.bool,
  /**
   * Boolean for rendering the label in bold or not
   */
  boldLabel: PropTypes.bool,
  /**
   * Sets the value for the currency prefix
   */
  currencySymbol: PropTypes.string,
}

FieldCurrency.defaultProps = {
  validate: (value) => number(value, 'Value must be a number'),
  required: null,
  label: null,
  legend: null,
  hint: null,
  initialValue: '',
  reduced: false,
  boldLabel: true,
}

export default FieldCurrency
