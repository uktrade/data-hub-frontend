import React, { useState, useEffect } from 'react'
import MultiChoice from '@govuk-react/multi-choice'
import PropTypes from 'prop-types'
import { GREY_2, YELLOW } from 'govuk-colours'
import styled, { css } from 'styled-components'
import {
  FONT_SIZE,
  MEDIA_QUERIES,
  SPACING,
  FONT_WEIGHTS,
} from '@govuk-react/constants'

import Checkbox from '../Checkbox'
import FieldWrapper from '../Form/elements/FieldWrapper'

const checkboxGroupElementStyles = css`
  legend {
    font-size: ${FONT_SIZE.SIZE_16};
    font-weight: ${FONT_WEIGHTS.bold};
  }
  label {
    font-weight: normal;
    margin-bottom: 4px;
    padding-left: 0;
  }
  li label {
    padding-left: 20px;
  }
  input {
    + span {
      padding: 10px 15px 5px;
      &::before {
        top: 8px;
        width: 24px;
        height: 24px;
      }
      &::after {
        top: 14px;
        left: 5px;
        width: 10px;
        height: 4.5px;
        border-width: 0 0 3px 3px;
      }
    }
    &:hover {
      + span {
        &::before {
          outline: 10px solid ${GREY_2};
        }
      }
    }
    &:focus {
      + span {
        &::before {
          box-shadow: 0 0 0 4px ${YELLOW};
        }
      }
    }
  }
`

const StyledFieldWrapper = styled(FieldWrapper)`
  margin-bottom: 14px;

  ${MEDIA_QUERIES.TABLET} {
    margin-bottom: 14px;
  }

  ${({ maxScrollHeight }) =>
    maxScrollHeight
      ? `
      fieldset > legend {
        font-size: ${FONT_SIZE.SIZE_16};
        font-weight: ${FONT_WEIGHTS.bold};
      }
      fieldset > div {
        overflow-y: scroll;
        max-height: ${maxScrollHeight}px;
        padding-left: 10px;
        margin-left: -10px;
        /* Taken from Gov.uk, these rules allow us to retain a permanent scrollbar */
        &::-webkit-scrollbar {
          -webkit-appearance: none;
          width: 7px;
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 4px;
          background-color: rgba(0, 0, 0, 0.5);
          -webkit-box-shadow: 0 0 1px rgb(255 255 255 / 87%);
        }
      }
      ${checkboxGroupElementStyles}`
      : checkboxGroupElementStyles}
`

const SelectedCount = styled('span')`
  font-size: ${FONT_SIZE.SIZE_14};
  display: block;
  padding: ${SPACING.SCALE_1} 0;
`

const StyledList = styled('ul')`
  padding: 0;
  margin: 0;
  list-style: none;
`

const StyledCheckbox = styled(Checkbox)`
  ${MEDIA_QUERIES.TABLET} {
    font-size: ${FONT_SIZE.SIZE_16};
  }
`

/**
 * Check box group field - shows a number of options as checkboxes
 *
 * @param {string} legend - legend label to display
 * @param {string} name - field name for the group
 * @param {string} hint - hint to display
 * @param {Array} options - the available options as objects with label and value
 * @param {Func} loadOptions - function to load options
 * @param {Array} selectedOptions - the options that have been selected
 * @param {Func} onChange - callback function that passes on the selected options
 * @param {number} maxScrollHeight - sets the visible area for the checkboxes before the overflow is set
 */

const CheckboxGroupField = ({
  legend,
  name,
  hint,
  options: initialOptions = [],
  loadOptions = null,
  selectedOptions = [],
  onChange = () => null,
  id,
  groupId = '',
  maxScrollHeight = 0,
  ...props
}) => {
  const [options, setOptions] = useState(initialOptions)
  const [loading, setLoading] = useState(loadOptions !== null)

  useEffect(() => {
    if (loadOptions !== null) {
      loadOptions().then((options) => {
        setLoading(false)
        setOptions(options)
      })
    }
  }, [options, loadOptions])

  return (
    <StyledFieldWrapper
      maxScrollHeight={maxScrollHeight}
      legend={legend}
      name={name}
      hint={hint}
      data-test={`checkbox-group-field-${name}`}
      groupId={groupId}
      {...props}
    >
      {loading ? (
        'Loading...'
      ) : (
        <>
          {maxScrollHeight > 0 && selectedOptions.length > 0 && (
            <SelectedCount>{`${selectedOptions.length} selected`}</SelectedCount>
          )}
          <MultiChoice>
            <StyledList>
              {options.map((option, i) => {
                const {
                  value: optionValue,
                  label: optionLabel,
                  ...optionProps
                } = option
                const checked = selectedOptions
                  .map(({ value }) => value)
                  .includes(optionValue)
                const otherOptions = [
                  ...selectedOptions.filter(
                    ({ value: otherOptionValue }) =>
                      otherOptionValue !== optionValue
                  ),
                ]
                const handleChange = (event) => {
                  if (event.target.checked) {
                    onChange([...otherOptions, option])
                  } else {
                    onChange(otherOptions)
                  }
                }
                const getCheckboxId = (name) => `field-${name}-${i + 1}`
                return (
                  <li key={optionValue}>
                    <StyledCheckbox
                      id={getCheckboxId(name)}
                      name={name}
                      initialChecked={checked}
                      value={optionValue}
                      onChange={handleChange}
                      aria-label={optionLabel}
                      aria-labelledby={`${getCheckboxId(name)} ${groupId}`}
                      {...optionProps}
                    >
                      {optionLabel}
                    </StyledCheckbox>
                  </li>
                )
              })}
            </StyledList>
          </MultiChoice>
        </>
      )}
    </StyledFieldWrapper>
  )
}

CheckboxGroupField.propTypes = {
  legend: PropTypes.string,
  name: PropTypes.string,
  hint: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })
  ).isRequired,
  loadOptions: PropTypes.func,
  selectedOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })
  ).isRequired,
  onChange: PropTypes.func,
  id: PropTypes.string,
  maxScrollHeight: PropTypes.number,
  groupId: PropTypes.string,
}

export default CheckboxGroupField
