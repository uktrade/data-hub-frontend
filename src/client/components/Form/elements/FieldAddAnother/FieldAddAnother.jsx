import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Link from '@govuk-react/link'
import { SPACING } from '@govuk-react/constants'

import { indexToOrdinal } from '../../../../../client/utils/number-utils'

import SecondaryButton from '../../../SecondaryButton'
import FieldWrapper from '../FieldWrapper'
import multiInstance from '../../../../utils/multiinstance'
import {
  FIELD_ADD_ANOTHER__ADD,
  FIELD_ADD_ANOTHER__REMOVE,
  FIELD_ADD_ANOTHER__INITIALISE,
} from '../../../../actions'
import reducer from './reducer'

const StyledChildren = styled('div')`
  padding-bottom: ${SPACING.SCALE_1};
`

const StyledGroup = styled('div')`
  padding-left: ${SPACING.SCALE_2};
  padding-bottom: ${SPACING.SCALE_3};
`

const StyledButton = styled('div')`
  padding-left: ${SPACING.SCALE_2};
`

const StyledLink = styled('div')`
  padding-bottom: ${SPACING.SCALE_1};
`

const FieldAddAnother = ({
  name,
  label,
  legend,
  hint,
  children,
  dataTestPrefix,
  itemName,
  buttonText,
  initialChildGroupCount = 1,
  limitChildGroupCount = Number.MAX_VALUE,
  childCount,
  fieldGroupIds,
  initialise,
  add,
  remove,
}) => {
  useEffect(() => {
    initialise(initialChildGroupCount)
  }, [initialChildGroupCount])

  const addAnotherHandler = (event) => {
    event.preventDefault()
    add()
  }

  return (
    <>
      <FieldWrapper {...{ name, label, legend, hint, bigLegend: true }}>
        {fieldGroupIds &&
          fieldGroupIds.map((item, index) => (
            <StyledGroup
              role="region"
              aria-label={`${indexToOrdinal(index)} ${itemName}`}
              data-test={`${dataTestPrefix}${index}`}
              key={item.fieldGroupId}
            >
              <StyledChildren>
                {children({
                  groupIndex: item.fieldGroupId,
                })}
              </StyledChildren>
              {fieldGroupIds.length > 1 && (
                <StyledLink>
                  <Link
                    href="#"
                    aria-label={`Remove ${indexToOrdinal(index)} ${itemName}`}
                    onClick={(event) => {
                      event.preventDefault()
                      remove(item.fieldGroupId)
                    }}
                  >
                    Remove
                  </Link>
                </StyledLink>
              )}
            </StyledGroup>
          ))}
        {childCount < limitChildGroupCount && (
          <StyledButton>
            <SecondaryButton
              data-test="add-another"
              onClick={addAnotherHandler}
              aria-label={`Add a ${indexToOrdinal(
                fieldGroupIds?.length || 0
              )} ${itemName}`}
            >
              {buttonText ? buttonText : `Add another ${itemName}`}
            </SecondaryButton>
          </StyledButton>
        )}
      </FieldWrapper>
    </>
  )
}

FieldAddAnother.propTypes = {
  dataTestPrefix: PropTypes.string,
  buttonText: PropTypes.string,
  itemName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.node,
  legend: PropTypes.node,
  hint: PropTypes.node,
  children: PropTypes.func,
  initialChildGroupCount: PropTypes.number,
  limitChildGroupCount: PropTypes.number,
  // Props from redux state
  fieldGroupIds: PropTypes.arrayOf(
    PropTypes.shape({
      fieldGroupId: PropTypes.number.isRequired,
    })
  ),
  initialise: PropTypes.func,
  add: PropTypes.func,
  remove: PropTypes.func,
}

export default multiInstance({
  name: 'FieldAddAnother',
  actionPattern: 'FIELD_ADD_ANOTHER__',
  dispatchToProps: (dispatch) => ({
    initialise: (initialChildGroupCount) =>
      dispatch({
        type: FIELD_ADD_ANOTHER__INITIALISE,
        initialChildGroupCount,
      }),
    add: () =>
      dispatch({
        type: FIELD_ADD_ANOTHER__ADD,
      }),
    remove: (fieldGroupId) =>
      dispatch({
        type: FIELD_ADD_ANOTHER__REMOVE,
        fieldGroupId,
      }),
  }),
  component: FieldAddAnother,
  reducer: reducer,
})
