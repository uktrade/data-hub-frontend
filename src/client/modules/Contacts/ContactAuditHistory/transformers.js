import { isBoolean, isNumber } from 'lodash'

import { transformFieldName } from '../../../components/AuditHistory/transformers'
import { CONTACT_FIELD_NAME_TO_LABEL_MAP } from './constants'
import { isUnparsedDateValid } from '../../../utils/date'
import {
  formatDate,
  DATE_FORMAT_MEDIUM_WITH_TIME,
} from '../../../utils/date-utils'
import {
  ARCHIVED,
  NO,
  NOT_ARCHIVED,
  NOT_SET,
  YES,
} from '../../../components/AuditHistory/constants'

export const mapFieldNameToLabel = (fieldName) =>
  CONTACT_FIELD_NAME_TO_LABEL_MAP[fieldName] || transformFieldName(fieldName)

export const getValue = (value, field) =>
  field === 'Archived'
    ? value
      ? ARCHIVED
      : NOT_ARCHIVED
    : isBoolean(value)
      ? value
        ? YES
        : NO
      : isNumber(value)
        ? value.toString()
        : isUnparsedDateValid(value)
          ? formatDate(value, DATE_FORMAT_MEDIUM_WITH_TIME)
          : value || NOT_SET
