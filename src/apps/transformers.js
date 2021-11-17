/* eslint-disable camelcase */
const { filter, keyBy, snakeCase, upperFirst } = require('lodash')
const { format, isDateValid } = require('../client/utils/date')
const { OPTION_NO, OPTION_YES } = require('./constants')

const { hqLabels } = require('./companies/labels')

function transformObjectToOption({ id, name }) {
  return {
    value: id,
    label: name,
  }
}

function transformObjectToGovUKOption({ id, name }) {
  return {
    value: id,
    text: name,
  }
}

function transformHQCodeToLabelledOption({ id, name }) {
  switch (name) {
    case 'ehq':
      return {
        value: id,
        label: hqLabels.ehq,
      }
    case 'ghq':
      return {
        value: id,
        label: hqLabels.ghq,
      }
    case 'ukhq':
      return {
        value: id,
        label: hqLabels.ukhq,
      }
  }
}

function transformStringToOption(string) {
  return {
    value: string,
    label: string,
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

function transformIdToObject(id) {
  return {
    id,
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

/**
 * Utility to build an object from a transformed metadata array of objects so you can reference properties
 * by key rather than array index. Helpful when the array length changes.
 * @returns {{}}
 */
function buildMetaDataObj(collection) {
  return keyBy(collection, (elem) => {
    return snakeCase(elem.label)
  })
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

module.exports = {
  buildMetaDataObj,
  transformHQCodeToLabelledOption,
  transformObjectToOption,
  transformStringToOption,
  transformContactToOption,
  transformCountryToOptionWithIsoCode,
  transformIdToObject,
  transformDateObjectToDateString,
  transformDateStringToDateObject,
  transformObjectToGovUKOption,
  transformOptionToValue,
  transformArrayOfOptionsToValues,
  transformToYesNo,
  transformToID,
  transformObjectToTypeahead,
}
