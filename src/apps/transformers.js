const { filter, upperFirst } = require('lodash')

const { format, isDateValid } = require('../client/utils/date')
const { OPTION_NO, OPTION_YES } = require('../common/constants')
const groupExportCountries = require('../lib/group-export-countries')

function transformObjectToOption({ id, name }) {
  return {
    value: id,
    label: name,
  }
}

function transformContactToOption({ id, first_name, last_name, job_title }) {
  return {
    value: id,
    label: upperFirst(
      filter([`${first_name} ${last_name}`, job_title]).join(', ')
    ),
  }
}

function transformCountryToOptionWithIsoCode({ id, name, iso_alpha2_code }) {
  return {
    key: id,
    label: name,
    value: iso_alpha2_code,
  }
}

function transformDateObjectToDateString(key) {
  if (!key) {
    throw Error('date object key is required to transform date')
  }
  return function transformDateObjectToStringWithKey(props = {}) {
    const dateString = ['year', 'month', 'day']
      .map((x) => props[`${key}_${x}`])
      .join('-')

    return dateString === '--' ? null : dateString
  }
}

function transformDateStringToDateObject(dateString) {
  const isValidDate = dateString && isDateValid(dateString)

  return {
    year: isValidDate ? format(dateString, 'yyyy') : '',
    month: isValidDate ? format(dateString, 'MM') : '',
    day: isValidDate ? format(dateString, 'dd') : '',
  }
}

const transformOptionToValue = (option) => {
  if (!option || !option.value) {
    return null
  }
  return option.value
}

const transformArrayOfOptionsToValues = (options) => {
  if (!options || !options.length) {
    return []
  }
  return options.map(transformOptionToValue)
}

const transformToID = (value) => {
  if (!value) {
    return value
  }
  return Array.isArray(value)
    ? value.map((optionFromArrayOfOptions) => optionFromArrayOfOptions.id)
    : value.id
}

const transformObjectToTypeahead = (value) => {
  if (!value) {
    return value
  }
  return Array.isArray(value)
    ? value.map(transformObjectToOption)
    : transformObjectToOption(value)
}

const transformToYesNo = (value) => (value ? OPTION_YES : OPTION_NO)

const transformExportCountriesToGroupStatus = (countries) =>
  groupExportCountries(countries)

module.exports = {
  transformObjectToOption,
  transformExportCountriesToGroupStatus,
  transformContactToOption,
  transformCountryToOptionWithIsoCode,
  transformDateObjectToDateString,
  transformDateStringToDateObject,
  transformOptionToValue,
  transformArrayOfOptionsToValues,
  transformToYesNo,
  transformToID,
  transformObjectToTypeahead,
}
