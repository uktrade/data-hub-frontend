import { uniq } from 'lodash'

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
  if (value && value.toLowerCase().includes('yes')) {
    return true
  } else if (value && value.toLowerCase().includes('no')) {
    return false
  }
  return null
}
