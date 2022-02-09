import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Link from '@govuk-react/link'
import { SPACING } from '@govuk-react/constants'

import { indexToOrdinal } from '../../../../../client/utils/number-utils'

import SecondaryButton from '../../../SecondaryButton'
import FieldWrapper from '../FieldWrapper'

const StyledChildren = styled('div')`
  padding-bottom: ${SPACING.SCALE_1};
`
const StyledButton = styled('div')``

const StyledLink = styled('div')`
  padding-bottom: ${SPACING.SCALE_1};
`
const FieldAddAnother = ({
  name,
  label,
  children,
  'data-test-prefix': dataTestPrefix,
  'item-name': ariaItemName,
  initialChildCount = 0,
}) => {
  const [internalValue, setInternalValue] = useState(
    [...Array(initialChildCount)].map((value, index) => ({
      fieldId: index,
    }))
  )

  const appendNewFieldValue = () => {
    const maximumFieldIdValue = getMaximumFieldIdValue()
    setInternalValue([...internalValue, { fieldId: maximumFieldIdValue + 1 }])

    function getMaximumFieldIdValue() {
      return internalValue
        .map((item) => item.fieldId)
        .reduce((previous, current) => {
          return current > previous ? current : previous
        }, 0)
    }
  }

  const findValueIndexById = (fieldIdToFind) =>
    internalValue.findIndex(({ fieldId }) => fieldId === fieldIdToFind)

  const removeValueById = (fieldId) => {
    const index = findValueIndexById(fieldId)
    let newInternalValue = [...internalValue]
    newInternalValue.splice(index, 1)
    setInternalValue(newInternalValue)
  }

  const addAnotherHandler = (event) => {
    event.preventDefault()
    appendNewFieldValue()
  }

  return (
    <>
      <FieldWrapper {...{ name, label }}>
        {internalValue.map((item, index) => (
          <div
            role="region"
            aria-label={`${indexToOrdinal(index)} ${ariaItemName}`}
            data-test={`${dataTestPrefix}${index}`}
            key={item.fieldId}
          >
            <StyledChildren>
              {children({
                index: item.fieldId,
              })}
            </StyledChildren>
            {internalValue.length > 1 && (
              <StyledLink>
                <Link
                  href="#"
                  aria-label={`Remove ${indexToOrdinal(index)} ${ariaItemName}`}
                  onClick={(event) => {
                    event.preventDefault()
                    removeValueById(item.fieldId)
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
            onClick={addAnotherHandler}
            aria-label={`Add a ${indexToOrdinal(
              internalValue.length
            )} ${ariaItemName}`}
          >
            Add another {ariaItemName}
          </SecondaryButton>
        </StyledButton>
      </FieldWrapper>
    </>
  )
}

FieldAddAnother.propTypes = {
  'data-test-prefix': PropTypes.string,
  'item-name': PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.node,
  children: PropTypes.func,
  initialChildCount: PropTypes.number,
}

FieldAddAnother.defaultProps = {
  label: null,
  initialChildCount: 0,
}

export default FieldAddAnother
