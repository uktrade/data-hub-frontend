import { uniq } from 'lodash'

import { OPTION_NO, OPTION_YES } from '../../common/constants'
import {
  formatDate,
  DATE_FORMAT_DAY,
  DATE_FORMAT_YEAR,
  DATE_FORMAT_MONTH,
} from '../../client/utils/date-utils'

export const transformDateObjectToDateString = (value) => {
  if (value) {
    const dateString = `${value?.year ?? ''}-${value?.month ?? ''}-${
      value?.day ?? ''
    }`
    return dateString === '--' ? null : dateString
  }
  return null
}

export const transformOption = (option) => {
  if (!option || !option.value) {
    return null
  }
  return option.value
}

export const transformArrayOfUniqueOptions = (options) => {
  if (!options || !options.length) {
    return []
  }
  return uniq(options.map(transformOption))
}

export const transformYesNoToBool = (value) => {
  if (value && value.toLowerCase().includes(OPTION_YES)) {
    return true
  } else if (value && value.toLowerCase().includes(OPTION_NO)) {
    return false
  }
  return null
}

export const transformBoolToYesNo = (value) => {
  if (value) {
    return OPTION_YES
  }
  return OPTION_NO
}

export const transformIdNameToValueLabel = (value) => {
  if (value) {
    const { id, name } = value
    return {
      value: id,
      label: name,
    }
  }
  return null
}

export const transformDateStringToDateObject = (dateISO) => {
  return {
    year: formatDate(dateISO, DATE_FORMAT_YEAR),
    month: formatDate(dateISO, DATE_FORMAT_MONTH),
    day: formatDate(dateISO, DATE_FORMAT_DAY),
  }
}

export const transformArrayIdNameToValueLabel = (values) => {
  if (values && values.length > 0) {
    return values.map(transformIdNameToValueLabel)
  }
  return []
}
