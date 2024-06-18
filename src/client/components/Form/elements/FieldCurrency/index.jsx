import React, { useEffect, useState } from 'react'
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
import { decimal, parseLocaleNumber } from '../../../../utils/number-utils'

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
  padding: ${BORDER_WIDTH};
  min-width: 47px;
  box-sizing: border-box;
  text-align: center;
  flex: 0 0 auto;
  cursor: default;
  font-size: ${FONT_SIZE.SIZE_19};
  background-color: ${LIGHT_GREY};
  line-height: 1.8;

  @media (max-width: ${BREAKPOINTS.TABLET}) {
    line-height: 2.1;
    font-size: ${FONT_SIZE.SIZE_16};
  }
  ${(props) =>
    props.error &&
    `
    border: ${BORDER_WIDTH_FORM_ELEMENT_ERROR} solid ${ERROR_COLOUR};
    border-right: 0px;
    line-height: 1.6;
    `}
`

const StyledCurrencyWrapper = styled('div')`
  display: flex;
  align-items: stretch;
  height: 47px;
  > * {
    height: 100%;
  }
`

/**
 * A basic currency field for numbers.
 */
const FieldCurrency = ({
  name,
  validate = (value) => number(value, 'Value must be a number'),
  required,
  label,
  text,
  legend,
  hint,
  initialValue = '',
  reduced,
  boldLabel = true,
  currencySymbol = '£',
  ...rest
}) => {
  const { value, error, touched, onChange, onBlur } = useField({
    name,
    validate,
    required,
    initialValue,
  })

  const [displayValue, setDisplayValue] = useState('')
  const [rawValue, setRawValue] = useState('')
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (!editing && value) {
      setRawValue(value)
      setDisplayValue(decimal(value))
    }
  }, [value])

  /**
   * Once focus leaves the input, format the entered value if it is a valid number then call the default onBlur
   */
  const onBlurWrapper = (e) => {
    setDisplayValue(isNaN(rawValue) ? rawValue : decimal(rawValue))
    setEditing(false)
    onBlur(e)
  }

  /**
   * When the value in the input changes, update the data-raw-value then call the default onChange
   */
  const onChangeWrapper = (e) => {
    if (!isNaN(parseLocaleNumber(e.target.value))) {
      setRawValue(parseLocaleNumber(e.target.value))
    } else {
      setRawValue(e.target.value)
    }
    setDisplayValue(e.target.value)
    onChange(e)
  }

  /**
   * When the input receives focus, set the input to have a value without any currency formatting
   */
  const onFocus = () => {
    setDisplayValue(rawValue)
    setEditing(true)
  }

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
            value={displayValue}
            data-raw-value={rawValue}
            onChange={onChangeWrapper}
            onBlur={onBlurWrapper}
            onFocus={onFocus}
            data-test={kebabCase(`${name}-'input'`)}
            inputMode="numeric"
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
   * Text 'required' sets whether the input is required or not
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
  initialValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * Toggles whether the element is a filter or not
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

export default FieldCurrency
