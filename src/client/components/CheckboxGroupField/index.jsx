import React, { useState, useEffect } from 'react'
import MultiChoice from '@govuk-react/multi-choice'
import { GREY_2, YELLOW } from 'govuk-colours'
import styled, { css } from 'styled-components'
import { FONT_SIZE } from '@govuk-react/constants'

import Checkbox from '../Checkbox'
import FieldWrapper from '../Form/elements/FieldWrapper'

const checkboxGroupElementStyles = css`
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
  ${({ visibleHeight }) =>
    visibleHeight
      ? `
      fieldset > div {
        overflow-y: scroll;
        max-height: ${visibleHeight}px;
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
  padding: 5px 0;
`

const StyledList = styled('ul')`
  padding: 0;
  margin: 0;
  list-style: none;
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
  visibleHeight = 0,
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
      visibleHeight={visibleHeight}
      legend={legend}
      name={name}
      hint={hint}
      data-test={`checkbox-group-field-${name}`}
      {...props}
    >
      {loading ? (
        'Loading...'
      ) : (
        <>
          {visibleHeight > 0 && selectedOptions.length > 0 && (
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
                return (
                  <li>
                    <Checkbox
                      id={`field-${name}-${i + 1}`}
                      key={optionValue}
                      name={name}
                      initialChecked={checked}
                      value={optionValue}
                      onChange={handleChange}
                      aria-label={optionLabel}
                      {...optionProps}
                    >
                      {optionLabel}
                    </Checkbox>
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

export default CheckboxGroupField
