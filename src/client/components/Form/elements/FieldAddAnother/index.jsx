import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { v4 as uuid } from 'uuid'
import Link from '@govuk-react/link'
import ErrorText from '@govuk-react/error-text'
import { ERROR_COLOUR } from 'govuk-colours'
import {
  BORDER_WIDTH_FORM_ELEMENT_ERROR,
  SPACING,
} from '@govuk-react/constants'

import { useField, useFormContext } from '../../hooks'
import SecondaryButton from '../../../SecondaryButton'
import FieldWrapper from '../FieldWrapper'

const StyledWrapper = styled('div')`
  ${(props) =>
    props.error &&
    `
    border-left: ${BORDER_WIDTH_FORM_ELEMENT_ERROR} solid ${ERROR_COLOUR};
    margin-right: ${SPACING.SCALE_3};
    padding-left: ${SPACING.SCALE_2};
  `}
  textarea {
    width: 100%;
  }
`

const StyledChildren = styled('div')`
  padding-bottom: ${SPACING.SCALE_1};
`

const StyledButton = styled('div')``

const StyledLink = styled('div')`
  padding-bottom: ${SPACING.SCALE_1};
`

const FieldAddAnother = ({
  name,
  validate,
  required,
  label,
  children,
  'data-test-prefix': data_test_prefix,
}) => {
  const { value, error } = useField({
    name,
    validate,
    required,
    initialValue: null,
  })

  const ensureFieldIds = (unvalidatedValue) =>
    unvalidatedValue.map(({ value, field_id }) => {
      if (field_id) {
        return { value, field_id }
      }
      return { value, field_id: uuid() }
    })

  const [internalValue, setInternalValue] = useState(
    ensureFieldIds(value || [])
  )

  const appendNewFieldValue = () => {
    const field_id = uuid()
    if (!internalValue) {
      setInternalValue([{ field_id }])
      return
    }
    setInternalValue([...internalValue, { field_id }])
  }

  const findValueIndexById = (field_id_to_find) =>
    internalValue.findIndex(({ field_id }) => field_id_to_find === field_id)

  const removeValueById = (field_id) => {
    const index_to_change = findValueIndexById(field_id)
    let newInternalValue = [...internalValue]
    newInternalValue.splice(index_to_change, 1)
    setInternalValue(newInternalValue)
  }

  const setValueById = (field_id, new_value) => {
    const index_to_change = findValueIndexById(field_id)
    let newInternalValue = [...internalValue]
    newInternalValue[index_to_change] = {
      field_id,
      ...new_value,
    }
    setInternalValue(newInternalValue)
  }

  const { setFieldValue } = useFormContext()

  useEffect(() => {
    if (internalValue.length === 0) {
      appendNewFieldValue()
      return
    }
  }, [])

  useEffect(() => {
    let newFieldValue = internalValue
      .map(({ value }) => ({ value }))
      .filter(({ value }) => value)
    if (newFieldValue.length === 0) {
      newFieldValue = null
    }
    setFieldValue(name, newFieldValue)
  }, [internalValue])

  const childOnChangeHandler = (field_id) => (new_value) => {
    setValueById(field_id, new_value)
  }

  return (
    <>
      <FieldWrapper {...{ name, label, error }}>
        <StyledWrapper error={error}>
          {error && <ErrorText>{error}</ErrorText>}
          {internalValue.map((item, index) => (
            <div data-test={`${data_test_prefix}${index}`} key={item.field_id}>
              <StyledChildren>
                {children({
                  onChange: childOnChangeHandler(item.field_id),
                  value: item.value,
                  error,
                })}
              </StyledChildren>
              {internalValue.length > 1 && (
                <StyledLink>
                  <Link
                    href="#"
                    onClick={(event) => {
                      removeValueById(item.field_id)
                      event.preventDefault()
                    }}
                  >
                    Remove
                  </Link>
                </StyledLink>
              )}
            </div>
          ))}
          <StyledButton>
            <SecondaryButton
              onClick={(event) => {
                appendNewFieldValue()
                event.preventDefault()
              }}
            >
              Add another
            </SecondaryButton>
          </StyledButton>
        </StyledWrapper>
      </FieldWrapper>
    </>
  )
}

FieldAddAnother.propTypes = {
  'data-test-prefix': PropTypes.string,
  name: PropTypes.string.isRequired,
  required: PropTypes.string,
  label: PropTypes.node,
  validate: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func),
  ]),
  children: PropTypes.func,
}

FieldAddAnother.defaultProps = {
  validate: null,
  required: null,
  label: null,
}

export default FieldAddAnother
