import React from 'react'
import PropTypes from 'prop-types'
import Select, { SelectInput } from '@govuk-react/select'
import LabelText from '@govuk-react/label-text'
import styled from 'styled-components'

import { useField } from '../../hooks'
import FieldWrapper from '../FieldWrapper'
import { BLACK, WHITE } from '../../../../utils/colours'

const StyledSelect = styled(Select)`
  position: relative;
  ${SelectInput} {
    width: initial;
    height: 47px;
    padding: 0px 46px 0px 12px;
    ${({ fullWidth }) => fullWidth && `width: 100%;`}
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;

    /*
    We need the caret to be positioned relative to the <select> and not the
    label which is wrapping it, otherwise the caret will be misplaced when the
    label texts spans multiple lines. We can't use an ::after pseudo element as
    it doesn't work with <select> and we also can't add a wrapper to the
    <select> as this is a @govuk-react component.

    The solution is to draw the carret to the background of the <select> with a
    combination of linear gradients. The gradient can be configured with the
    following parameters:
    */
    --caret-height: 10px;
    --stroke-width: 2px;
    --stroke-colour: ${BLACK};
    // Can't be transparent
    --mask-colour: ${WHITE};

    --_bg-pos-and-size: right calc(50% + var(--caret-height) / 2) /
      calc(var(--caret-height) * 4) calc(var(--caret-height) * 4) no-repeat;

    background:
      // Left wing START
      // Top mask (clips the caret wing)
      linear-gradient(-45deg, transparent calc(75%), 0, var(--mask-colour))
        var(--_bg-pos-and-size),
      // Bottom mask (clips the bottom part of the stroke, just after the two strokes cross)
      linear-gradient(
          -45deg,
          var(--mask-colour) calc(50% - var(--stroke-width) / 2),
          0,
          transparent calc(50% + var(--stroke-width) / 2),
          0,
          transparent
        )
        var(--_bg-pos-and-size),
      // Stroke
      linear-gradient(
          45deg,
          transparent calc(50% - var(--stroke-width) / 2),
          0,
          var(--stroke-colour) calc(50% + var(--stroke-width) / 2),
          0,
          transparent
        )
        var(--_bg-pos-and-size),
      // Left wing END
      // Righ wing START
      // Top mask (clips the caret wing)
      linear-gradient(45deg, transparent calc(75%), 0, var(--mask-colour))
        var(--_bg-pos-and-size),
      // Bottom mask (clips the bottom part of the stroke, just after the two strokes cross)
      linear-gradient(
          45deg,
          var(--mask-colour) calc(50% - var(--stroke-width) / 2),
          0,
          transparent calc(50% + var(--stroke-width) / 2),
          0,
          transparent
        )
        var(--_bg-pos-and-size),
      // Stroke
      linear-gradient(
          -45deg,
          transparent calc(50% - var(--stroke-width) / 2),
          0,
          var(--stroke-colour) calc(50% + var(--stroke-width) / 2),
          0,
          transparent
        )
        var(--_bg-pos-and-size);
    // Righ wing END
  }
  /*
  We hide the label if it's empty, because it still contributes to the element's
  height.
   */
  ${LabelText}:empty {
    display: none;
  }
`

/**
 * A Select dropdown field for use in forms.
 */
const FieldSelect = ({
  name,
  label,
  legend,
  hint,
  validate,
  required,
  initialValue,
  options = [],
  emptyOption = 'Please select',
  fullWidth,
  boldLabel = true,
  className,
  style,
  ...rest
}) => {
  const { error, touched, value, onChange, onBlur } = useField({
    name,
    validate,
    required,
    initialValue,
  })
  return (
    <FieldWrapper
      {...{ name, label, legend, hint, error, boldLabel, className, style }}
    >
      <StyledSelect
        fullWidth={fullWidth}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        meta={{ error, touched }}
        key={Array.isArray(options) && options.length > 0 ? value : undefined}
        input={{
          id: name,
          defaultValue: value,
          ...rest,
        }}
      >
        {emptyOption && (
          <option key="" value="">
            {emptyOption}
          </option>
        )}
        {options.map(({ label: optionLabel, value: optionValue }) => (
          <option
            key={optionValue}
            value={optionValue}
            selected={value === optionValue}
          >
            {optionLabel}
          </option>
        ))}
      </StyledSelect>
      {options.find((o) => o.value === value)?.children}
    </FieldWrapper>
  )
}

FieldSelect.propTypes = {
  /**
   * Text for name attribute value
   */
  name: PropTypes.string.isRequired,
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
   * Sets initial value of the input
   */
  initialValue: PropTypes.string,
  /**
   * Items for the list
   */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  /**
   * Text to display when no items are selected
   */
  emptyOption: PropTypes.string,
  /***
   * Always render this select component in 100% width, the default is 50%
   */
  fullWidth: PropTypes.bool,
  /**
   * Boolean for rendering the label in bold or not
   */
  boldLabel: PropTypes.bool,
}

export default FieldSelect
