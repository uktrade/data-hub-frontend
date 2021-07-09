import React from 'react'
import PropTypes from 'prop-types'
import { isBoolean, isNumber } from 'lodash'

import { CHANGE_TYPE_TEXT, TRUE, FALSE, NOT_SET } from '../constants'

import EditHistory from '../../../client/components/EditHistory/EditHistory'

const {
  formatMediumDateTime,
  isDateValid,
} = require('../../../client/utils/date')

function getValue(value) {
  if (isBoolean(value)) {
    return value ? TRUE : FALSE
  }

  if (isNumber(value)) {
    // TODO: update with currency fields when confirmed (see CompanyEditHistory.jsx)
    return value.toString()
  }

  if (isDateValid(value)) {
    return formatMediumDateTime(value)
  }

  return value || NOT_SET
}

function getUpdatedBy(timestamp, changedBy) {
  const formattedTime = formatMediumDateTime(timestamp)
  return `Updated on ${formattedTime} by ${changedBy}`
}

function InvestmentEditHistory({ dataEndpoint }) {
  return (
    <EditHistory
      dataEndpoint={dataEndpoint}
      changeType={CHANGE_TYPE_TEXT}
      getUpdatedBy={getUpdatedBy}
      getValue={getValue}
    />
  )
}

InvestmentEditHistory.propTypes = {
  dataEndpoint: PropTypes.string.isRequired,
}

export default InvestmentEditHistory
