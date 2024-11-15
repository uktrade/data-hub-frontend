import { isBoolean, isNumber } from 'lodash'

import { PROJECT_FIELD_NAME_TO_LABEL_MAP } from './constants'
import { formatMediumDate, isUnparsedDateValid } from '../../../../utils/date'
import { currencyGBP } from '../../../../utils/number-utils'
import { NOT_SET, NO, YES } from '../../../../components/AuditHistory/constants'
import { transformFieldName } from '../../../../components/AuditHistory/transformers'

const CURRENCY_FIELDS = [
  'Total investment',
  'Foreign equity investment',
  'Gross Value Added (GVA)',
]

const INVERTED_BOOL_FIELDS = [
  'Can client provide total investment value?',
  'Can client provide capital expenditure value?',
]

export const mapFieldNameToLabel = (fieldName) =>
  PROJECT_FIELD_NAME_TO_LABEL_MAP[fieldName] || transformFieldName(fieldName)

export const getValue = (value, field) =>
  CURRENCY_FIELDS.includes(field) && isNumber(value)
    ? currencyGBP(value)
    : isBoolean(value) && INVERTED_BOOL_FIELDS.includes(field)
      ? value
        ? NO
        : YES
      : isBoolean(value)
        ? value
          ? YES
          : NO
        : isNumber(value)
          ? value.toString()
          : Array.isArray(value)
            ? value.join(', ')
            : isUnparsedDateValid(value)
              ? formatMediumDate(value)
              : value || NOT_SET
