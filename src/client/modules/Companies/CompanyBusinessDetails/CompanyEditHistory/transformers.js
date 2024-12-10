import { isBoolean, isNumber } from 'lodash'

import {
  formatDate,
  normaliseToDate,
  DATE_FORMAT_MEDIUM_WITH_TIME,
} from '../../../../utils/date-utils'
import { COMPANY_FIELD_NAME_TO_LABEL_MAP, HEADQUARTER_TYPES } from './constants'
import {
  ARCHIVED,
  NOT_ARCHIVED,
  NOT_SET,
  YES,
  NO,
} from '../../../../components/AuditHistory/constants'
import { currencyGBP } from '../../../../utils/number-utils'
import { transformFieldName } from '../../../../components/AuditHistory/transformers'

export const mapFieldNameToLabel = (fieldName) =>
  COMPANY_FIELD_NAME_TO_LABEL_MAP[fieldName] || transformFieldName(fieldName)

const getValueFromBoolean = (value, field) => {
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

export const getValue = (value, field) => {
  const date = normaliseToDate(value)

  if (isBoolean(value)) {
    return getValueFromBoolean(value, field)
  }

  if (isNumber(value)) {
    if (field === 'Turnover') {
      return currencyGBP(value, { maximumSignificantDigits: 2 })
    }
    return value.toString()
  }

  if (date) {
    return formatDate(date, DATE_FORMAT_MEDIUM_WITH_TIME)
  }

  if (field === 'Headquarter type') {
    return HEADQUARTER_TYPES[value] || NOT_SET
  }

  return value || NOT_SET
}
