import React from 'react'
import PropTypes from 'prop-types'
import { castArray, snakeCase } from 'lodash'
import styled from 'styled-components'
import { ERROR_COLOUR } from 'govuk-colours'
import ErrorText from '@govuk-react/error-text'
import Label from '@govuk-react/label'
import Input from '@govuk-react/input'
import LabelText from '@govuk-react/label-text'
import {
  BORDER_WIDTH_FORM_ELEMENT_ERROR,
  SPACING,
} from '@govuk-react/constants'

import FieldWrapper from '../FieldWrapper'
import useField from '../../hooks/useField'
import { useFormContext } from '../../hooks'

const {
  isNormalisedDateValid,
  isShortDateValid,
} = require('../../../../utils/date')

const DAY = 'day'
const MONTH = 'month'
const YEAR = 'year'
const FORMAT_LONG = 'LONG'

const StyledInputWrapper = styled('div')`
  ${(props) =>
    props.error &&
    `
    border-left: ${BORDER_WIDTH_FORM_ELEMENT_ERROR} solid ${ERROR_COLOUR};
    margin-right: ${SPACING.SCALE_3};
    padding-left: ${SPACING.SCALE_2};
  `}
`

const StyledLabel = styled(Label)(
  {
    marginRight: '20px',
    marginBottom: 0,
  },
  ({ year }) => ({
    width: year ? '70px' : '50px',
  })
)

const StyledList = styled('div')({
  display: 'flex',
})

const getValidator =
  (required, invalid, format) =>
  ({ day, month, year }) => {
    const isLong = format === FORMAT_LONG
    const isValid = isLong
      ? isNormalisedDateValid(year, month, day)
      : isShortDateValid(year, month)

    const isDateEmpty = isLong ? !day && !month && !year : !month && !year

    if (required && isDateEmpty) {
      return required
    }

    if (!isValid && !isDateEmpty) {
      return invalid || 'Enter a valid date'
    }
  }

const getDefaultInitialValue = (format) => {
  return format === FORMAT_LONG
    ? {
        day: '',
        month: '',
        year: '',
      }
    : { month: '', year: '' }
}

/**
 * Date field for use in forms and filters.
 */
const FieldDate = ({
  name,
  label,
  legend,
  hint,
  validate,
  initialValue,
  labels,
  required,
  invalid,
  format,
  reduced,
  ...props
}) => {
  const { value, error, touched, onBlur } = useField({
    name,
    initialValue: initialValue || getDefaultInitialValue(format),
    validate: [getValidator(required, invalid, format), ...castArray(validate)],
  })

  const { setFieldValue } = useFormContext()

  const dataTest = props['data-test'] ? props['data-test'] : snakeCase(name)

  const onChange = (valueKey, e) => {
    const date = e.target.value.split('-')
    reduced
      ? setFieldValue(name, {
          ...value,
          day: date[2],
          month: date[1],
          year: date[0],
        })
      : setFieldValue(name, {
          ...value,
          [valueKey]: e.target.value,
        })
  }

  return (
    <FieldWrapper {...{ name, label, legend, hint, error, reduced }}>
      <StyledInputWrapper error={error}>
        {error && <ErrorText>{error}</ErrorText>}
        {reduced ? (
          <Input
            id={name}
            name={name}
            error={touched && error}
            type="date"
            value={`${value.year}-${value.month}-${value.day}`}
            onChange={(e) => onChange(name, e)}
            onBlur={onBlur}
          />
        ) : (
          <StyledList>
            {format === FORMAT_LONG && (
              <StyledLabel>
                <LabelText>{labels.day}</LabelText>
                <Input
                  id={`${name}.day`}
                  name={`${name}.day`}
                  data-test={`${dataTest}-day`}
                  error={touched && error}
                  type="number"
                  value={value.day}
                  onChange={(e) => onChange(DAY, e)}
                  onBlur={onBlur}
                />
              </StyledLabel>
            )}
            <StyledLabel>
              <LabelText>{labels.month}</LabelText>
              <Input
                id={`${name}.month`}
                name={`${name}.month`}
                data-test={`${dataTest}-month`}
                error={touched && error}
                type="number"
                value={value.month}
                onChange={(e) => onChange(MONTH, e)}
                onBlur={onBlur}
              />
            </StyledLabel>
            <StyledLabel year={true}>
              <LabelText>{labels.year}</LabelText>
              <Input
                id={`${name}.year`}
                name={`${name}.year`}
                data-test={`${dataTest}-year`}
                error={touched && error}
                type="number"
                value={value.year}
                onChange={(e) => onChange(YEAR, e)}
                onBlur={onBlur}
              />
            </StyledLabel>
          </StyledList>
        )}
      </StyledInputWrapper>
    </FieldWrapper>
  )
}

FieldDate.propTypes = {
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
  hint: PropTypes.string,
  /**
   * Text 'required' sets wether the input is required or not
   */
  required: PropTypes.string,
  /**
   * Text 'invalid' sets a custom error message for invalid dates
   */
  invalid: PropTypes.string,
  format: PropTypes.string,
  /**
   * Validate functions for input
   */
  validate: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func),
  ]),
  /**
   * Sets initial value of the input
   */
  initialValue: PropTypes.shape({
    day: PropTypes.string,
    month: PropTypes.string,
    year: PropTypes.string,
  }),
  labels: PropTypes.shape({
    day: PropTypes.string,
    month: PropTypes.string,
    year: PropTypes.string,
  }),
  /**
   * Toggles wether the element is a filter or not
   */
  reduced: PropTypes.bool,
}

FieldDate.defaultProps = {
  label: null,
  legend: null,
  hint: null,
  required: null,
  invalid: null,
  format: FORMAT_LONG,
  validate: null,
  initialValue: null,
  labels: {
    day: 'Day',
    month: 'Month',
    year: 'Year',
  },
  reduced: false,
}

export default FieldDate
