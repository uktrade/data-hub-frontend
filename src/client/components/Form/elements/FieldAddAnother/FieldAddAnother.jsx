import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'

import { indexToOrdinal } from '../../../../../client/utils/number-utils'

import SecondaryButton from '../../../SecondaryButton'
import FieldWrapper from '../FieldWrapper'
import multiInstance from '../../../../utils/multiinstance'
import {
  FIELD_ADD_ANOTHER__ADD,
  FIELD_ADD_ANOTHER__REMOVE,
} from '../../../../actions'
import reducer from './reducer'
import AccessibleLink from '../../../Link'

const StyledChildren = styled('div')`
  padding-bottom: ${SPACING.SCALE_1};
`

const StyledGroup = styled('div')`
  padding-bottom: ${SPACING.SCALE_3};
`

const SecondaryButtonContainer = styled('div')`
  margin-top: ${SPACING.SCALE_4};
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
  add,
  remove,
  // State props
  items = _(initialChildGroupCount).range().keyBy().value(),
  buttonMargin,
}) => {
  const fieldGroupIds = Object.keys(items)

  const addAnotherHandler = (event) => {
    event.preventDefault()
    add(initialChildGroupCount)
  }

  return (
    <>
      <FieldWrapper {...{ name, label, legend, hint, bigLegend: true }}>
        {fieldGroupIds.map((fieldGroupId, index) => (
          <StyledGroup
            role="region"
            aria-label={`${indexToOrdinal(index)} ${itemName}`}
            data-test={`${dataTestPrefix}${index}`}
            key={fieldGroupId}
          >
            <StyledChildren>
              {children({
                groupIndex: fieldGroupId,
              })}
            </StyledChildren>
            {fieldGroupIds.length > 1 && (
              <StyledLink>
                <AccessibleLink
                  href="#"
                  aria-label={`Remove ${indexToOrdinal(index)} ${itemName}`}
                  onClick={(event) => {
                    event.preventDefault()
                    remove(fieldGroupId, initialChildGroupCount)
                  }}
                >
                  Remove
                </AccessibleLink>
              </StyledLink>
            )}
          </StyledGroup>
        ))}
        {fieldGroupIds.length < limitChildGroupCount && (
          <SecondaryButtonContainer>
            <SecondaryButton
              data-test="add-another"
              onClick={addAnotherHandler}
              aria-label={`Add a ${indexToOrdinal(
                fieldGroupIds.length || 0
              )} ${itemName}`}
              margin={buttonMargin}
            >
              {buttonText ? buttonText : `Add another ${itemName}`}
            </SecondaryButton>
          </SecondaryButtonContainer>
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
}

export default multiInstance({
  name: 'FieldAddAnother',
  actionPattern: 'FIELD_ADD_ANOTHER__',
  dispatchToProps: (dispatch) => ({
    add: (initialChildGroupCount) =>
      dispatch({
        type: FIELD_ADD_ANOTHER__ADD,
        initialChildGroupCount,
      }),
    remove: (fieldGroupId, initialChildGroupCount) =>
      dispatch({
        type: FIELD_ADD_ANOTHER__REMOVE,
        fieldGroupId,
        initialChildGroupCount,
      }),
  }),
  component: FieldAddAnother,
  reducer: reducer,
})
