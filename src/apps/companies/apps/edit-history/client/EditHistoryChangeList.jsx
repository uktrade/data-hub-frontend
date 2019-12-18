import React from 'react'
import PropTypes from 'prop-types'
import { isBoolean, capitalize } from 'lodash'
import { FONT_SIZE } from '@govuk-react/constants'
import moment from 'moment'
import styled from 'styled-components'
import { SummaryTable, DateUtils } from 'data-hub-components'
import { ARCHIVED, NOT_ARCHIVED, NOT_SET } from '../constants'

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

const FIELD_TO_LABEL_MAP = {
  uk_region: 'UK Region',
}

function getCaption (fieldName) {
  return FIELD_TO_LABEL_MAP[fieldName] ||
    fieldName
      .split('_')
      .map(word => capitalize(word))
      .join(' ')
}

function getValue (value) {
  if (isBoolean(value)) {
    return value ? ARCHIVED : NOT_ARCHIVED
  }

  if (moment(value).isValid()) {
    return DateUtils.formatWithTime(value)
  }

  return value || NOT_SET
}
function EditHistoryChangeList ({ changes }) {
  return (
    <div>
      {changes.map(({ fieldName, oldValue, newValue }) => (
        <div key={fieldName}>
          <StyledSummaryTable caption={getCaption(fieldName)}>
            <SummaryTable.Row heading="Information before change">
              {getValue(oldValue)}
            </SummaryTable.Row>
            <SummaryTable.Row heading="Information after change">
              {getValue(newValue)}
            </SummaryTable.Row>
          </StyledSummaryTable>
        </div>
      ))}
    </div>
  )
}

EditHistoryChangeList.propTypes = {
  changes: PropTypes.array.isRequired,
  changedBy: PropTypes.string.isRequired,
}

export default EditHistoryChangeList
