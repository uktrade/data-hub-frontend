import React from 'react'
import PropTypes from 'prop-types'
import { FONT_SIZE } from '@govuk-react/constants'
import styled from 'styled-components'
import { SummaryTable } from '../../components/'

const StyledSummaryTable = styled(SummaryTable)`
  caption {
    font-size: ${FONT_SIZE.SIZE_16};
  }

  & > tbody > tr:first-child {
    border-top: none;
  }

  & > tbody > tr > th {
    border: none;
    font-weight: normal;
  }

  & > tbody > tr > td {
    border: none;
    font-weight: bold;
  }
`

const StyledNoChanges = styled('div')`
  font-size: 16px;
  padding: 30px 0;
`

function EditHistoryChangeList({ changes, changeType, getValue }) {
  return (
    <>
      {changes.map(({ fieldName, oldValue, newValue }) => (
        <StyledSummaryTable caption={fieldName} key={fieldName}>
          <SummaryTable.Row heading="Information before change">
            {getValue(oldValue, fieldName)}
          </SummaryTable.Row>
          <SummaryTable.Row heading="Information after change">
            {getValue(newValue, fieldName)}
          </SummaryTable.Row>
        </StyledSummaryTable>
      ))}
      {changes.length === 0 && (
        <StyledNoChanges>
          No changes were made to {changeType} in this update
        </StyledNoChanges>
      )}
    </>
  )
}

EditHistoryChangeList.propTypes = {
  changes: PropTypes.array.isRequired,
  changedBy: PropTypes.string.isRequired,
  changeType: PropTypes.string.isRequired,
  getValue: PropTypes.func.isRequired,
}

export default EditHistoryChangeList
