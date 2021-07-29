import React from 'react'
import PropTypes from 'prop-types'
import { isBoolean, isNumber } from 'lodash'
import { convertUsdToGbp } from '../../../../../common/currency'

import EditHistory from '../../../../../client/components/EditHistory/EditHistory'
import { currencyGBP } from '../../../../../client/utils/number-utils'

import {
  ARCHIVED,
  NOT_ARCHIVED,
  YES,
  NO,
  AUTOMATIC_UPDATE,
  CHANGE_TYPE_TEXT,
  NOT_SET,
} from '../constants'

const {
  formatMediumDateTime,
  isDateValid,
} = require('../../../../../client/utils/date')

const CURRENCY_FIELDS = ['Turnover']

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
}

function getValue(value, field) {
  if (isBoolean(value)) {
    return getValueFromBoolean(value, field)
  }

  if (isNumber(value)) {
    return CURRENCY_FIELDS.includes(field)
      ? currencyGBP(convertUsdToGbp(value), {
          maximumSignificantDigits: 2,
        })
      : value.toString()
  }

  if (isDateValid(value)) {
    return formatMediumDateTime(value)
  }

  return value || NOT_SET
}

function getUpdatedBy(timestamp, changedBy) {
  const formattedTime = formatMediumDateTime(timestamp)
  return changedBy === AUTOMATIC_UPDATE
    ? `Automatically updated on ${formattedTime}`
    : `Updated on ${formattedTime} by ${changedBy}`
}

function CompanyEditHistory({ dataEndpoint }) {
  return (
    <EditHistory
      dataEndpoint={dataEndpoint}
      changeType={CHANGE_TYPE_TEXT}
      getUpdatedBy={getUpdatedBy}
      getValue={getValue}
    />
  )
}

CompanyEditHistory.propTypes = {
  dataEndpoint: PropTypes.string.isRequired,
}

export default CompanyEditHistory
