import { isBoolean, isNumber } from 'lodash'

import {
  formatMediumDateTimeWithoutParsing,
  isUnparsedDateValid,
} from '../../../../utils/date'
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

export const getValue = (value, field) =>
  isBoolean(value)
    ? getValueFromBoolean(value, field)
    : isNumber(value)
      ? field === 'Turnover'
        ? currencyGBP(value, {
            maximumSignificantDigits: 2,
          })
        : value.toString()
      : isUnparsedDateValid(value)
        ? formatMediumDateTimeWithoutParsing(value)
        : field === 'Headquarter type'
          ? HEADQUARTER_TYPES[value] || NOT_SET
          : value || NOT_SET
