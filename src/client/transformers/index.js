import { uniq } from 'lodash'
import { OPTION_NO, OPTION_YES } from '../../client/constants'
import { format, isDateValid } from '../../client/utils/date'

export const transformDateObjectToDateString = (value) => {
  const dateString = `${value?.year}-${value?.month}-${value?.day}`
  return dateString === '--' ? null : dateString
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

export const transformDateStringToDateObject = (dateString) => {
  const isValidDate = dateString && isDateValid(dateString)

  return {
    year: isValidDate ? format(dateString, 'yyyy') : '',
    month: isValidDate ? format(dateString, 'MM') : '',
    day: isValidDate ? format(dateString, 'dd') : '',
  }
}

export const transformArrayIdNameToValueLabel = (values) => {
  if (values && values.length > 0) {
    return values.map(transformIdNameToValueLabel)
  }
  return []
}
