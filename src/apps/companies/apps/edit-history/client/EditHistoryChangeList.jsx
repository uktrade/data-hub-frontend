import React from 'react'
import PropTypes from 'prop-types'
import { isBoolean, isNumber } from 'lodash'
import { FONT_SIZE } from '@govuk-react/constants'
import moment from 'moment'
import styled from 'styled-components'
import { SummaryTable, DateUtils, NumberUtils } from 'data-hub-components'
import { ARCHIVED, NOT_ARCHIVED, NOT_SET, YES, NO } from '../constants'
import { convertUSDToGBP } from '../../../../../common/currency'

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
const CURRENCY_FIELDS = ['Turnover']

function isDate(dateStr) {
  return moment(dateStr, moment.ISO_8601, true).isValid()
}

function getValueFromBoolean(value, field) {
  if (
    field === 'Is number of employees estimated' ||
    field === 'Is turnover estimated'
  ) {
    return value ? YES : NO
  }

  if (field === 'Archived') {
    return value ? ARCHIVED : NOT_ARCHIVED
  }

  return value
}

function getValue(value, field) {
  if (isBoolean(value)) {
    return getValueFromBoolean(value, field)
  }

  if (isDate(value)) {
    return DateUtils.formatWithTime(value)
  }

  if (isNumber(value)) {
    return CURRENCY_FIELDS.includes(field)
      ? NumberUtils.currencyGBP(convertUSDToGBP(value))
      : value.toString()
  }

  return value || NOT_SET
}

function EditHistoryChangeList({ changes }) {
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
          No changes were made to business details in this update
        </StyledNoChanges>
      )}
    </>
  )
}

EditHistoryChangeList.propTypes = {
  changes: PropTypes.array.isRequired,
  changedBy: PropTypes.string.isRequired,
}

export default EditHistoryChangeList
