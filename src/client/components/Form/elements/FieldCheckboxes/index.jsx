import React, { Fragment } from 'react'
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

const StyledLabel = styled('span')({
  fontWeight: 'bold',
})

/**
 * Checkboxes for use in forms and filters.
 */
const FieldCheckboxes = ({
  name,
  validate,
  required,
  label,
  legend,
  bigLegend,
  boldLabel = false,
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
    const eventTargetName = isNaN(event.target.name)
      ? event.target.name
      : parseInt(event.target.name, 10)

    if (event.target.checked) {
      setFieldValue(name, [...value, eventTargetName])
    } else {
      setFieldValue(
        name,
        value.filter((v) => v !== eventTargetName)
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
            <Fragment key={optionValue}>
              {exclusive && index === options.length - 1 && (
                <StyledOr data-test="exclusive-or">or</StyledOr>
              )}
              <Checkbox
                name={optionValue}
                checked={value.includes(optionValue)}
                onChange={exclusive ? onChangeExclusive : onChange}
                onBlur={onBlur}
                aria-label={optionLabel}
                {...optionProps}
              >
                {boldLabel ? (
                  <StyledLabel>{optionLabel}</StyledLabel>
                ) : (
                  optionLabel
                )}
              </Checkbox>
              {value.includes(optionValue) && !!children ? children : null}
            </Fragment>
          )
        )}
      </MultiChoice>
    </FieldWrapper>
  )
}

FieldCheckboxes.propTypes = {
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
   * Splits the last checkbox from the others where the choice is exclusive between them
   */
  exclusive: PropTypes.bool,
  /**
   * Sets initial value of the input
   */
  initialValue: PropTypes.array,
  /**
   * Defines the checkbox labels and values
   */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      children: PropTypes.node,
    })
  ),
}

export default FieldCheckboxes
