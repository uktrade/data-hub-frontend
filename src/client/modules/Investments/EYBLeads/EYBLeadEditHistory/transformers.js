import { isBoolean, isNumber } from 'lodash'

import { EYB_LEAD_FIELD_NAME_TO_LABEL_MAP } from './constants'
import { NOT_SET, YES, NO } from '../../../../components/AuditHistory/constants'
import { transformFieldName } from '../../../../components/AuditHistory/transformers'
import {
  convertEYBChoicesToLabels,
  formatProposedInvestmentCity,
} from '../../utils'

export const mapFieldNameToLabel = (fieldName) =>
  EYB_LEAD_FIELD_NAME_TO_LABEL_MAP[fieldName] || transformFieldName(fieldName)

const getValueFromBoolean = (value, field) => {
  if (field === 'Value') {
    return value ? 'High' : 'Low'
  }
  return value ? YES : NO
}

export const getValue = (value, field) => {
  if (isBoolean(value)) {
    return getValueFromBoolean(value, field)
  }

  if (isNumber(value)) {
    return value.toString()
  }

  if (field === 'Where do you want to set up in the UK?') {
    return formatProposedInvestmentCity(value) || NOT_SET
  }

  if (
    field === 'How do you plan to expand your business in the UK?' ||
    field === 'When do you want to set up?'
  ) {
    return convertEYBChoicesToLabels(value) || NOT_SET
  }

  if (
    field ===
    'How many people do you want to hire in the UK in the first 3 years?'
  ) {
    if (value === 'NO_PLANS_TO_HIRE_YET') {
      return convertEYBChoicesToLabels(value)
    }
  }

  return value || NOT_SET
}
