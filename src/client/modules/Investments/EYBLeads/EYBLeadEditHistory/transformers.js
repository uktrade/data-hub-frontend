import { isBoolean } from 'lodash'

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
  if (field === EYB_LEAD_FIELD_NAME_TO_LABEL_MAP.is_high_value) {
    return value ? 'High' : 'Low'
  }
  return value ? YES : NO
}

export const getValue = (value, field) => {
  if (isBoolean(value)) {
    return getValueFromBoolean(value, field)
  }

  if (field === EYB_LEAD_FIELD_NAME_TO_LABEL_MAP.proposed_investment_city) {
    return formatProposedInvestmentCity(value) || NOT_SET
  }

  if (
    field === EYB_LEAD_FIELD_NAME_TO_LABEL_MAP.intent ||
    field === EYB_LEAD_FIELD_NAME_TO_LABEL_MAP.landing_timeframe
  ) {
    return convertEYBChoicesToLabels(value) || NOT_SET
  }

  if (field === EYB_LEAD_FIELD_NAME_TO_LABEL_MAP.hiring) {
    if (value === 'NO_PLANS_TO_HIRE_YET') {
      return convertEYBChoicesToLabels(value)
    }
  }

  return value || NOT_SET
}
