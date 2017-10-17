const nunjucks = require('nunjucks')
const moment = require('moment')
require('moment-duration-format')
const dateFns = require('date-fns')
const Case = require('case')
const numeral = require('numeral')
const {
  assign,
  concat,
  isArray,
  isFunction,
  isPlainObject,
  isEmpty,
  isNull,
  isString,
  pickBy,
  filter,
  reject,
  isNil,
  keys,
  values,
  flatten,
  map,
  mapValues,
  omit,
  pick,
  lowerCase,
  kebabCase,
} = require('lodash')
require('numeral/locales/en-gb')

numeral.locale('en-gb')

const { longDateFormat, mediumDateTimeFormat, currencyFormat } = require('../../config')

function isNotEmpty (value) {
  return !isNil(value) && !/^\s*$/.test(value) && !(isPlainObject(value) && isEmpty(value))
}

function pluralise (string, count, pluralisedWord) {
  if (parseInt(count, 10) !== 1) {
    if (pluralisedWord) {
      string = pluralisedWord
    } else if (string.match(/[^aeiou]y$/)) {
      string = string.replace(/y$/, 'ies')
    } else {
      string += 's'
    }
  }

  return string
}

const filters = {
  stringify: JSON.stringify,
  sentenceCase: Case.sentence,
  lowerCase,
  kebabCase,
  assign,
  concat,
  filter,
  reject,
  values,
  keys,
  flatten,
  map,
  omit,
  pick,
  mapValues,
  isArray,
  isFunction,
  isNull,
  isPlainObject,
  isString,
  pluralise,

  assignCopy (...args) {
    return assign({}, ...args)
  },

  split (value, separator) {
    if (!isString(value)) { return value }

    return value.split(separator)
  },

  highlight (string, searchTerm, shouldMatchFullWord = false) {
    if (!isString(string) || !isString(searchTerm) || !searchTerm.trim()) { return string }

    const regEx = new RegExp(`(${searchTerm})${shouldMatchFullWord ? '\\b' : ''}`, 'gi')
    const result = string.replace(regEx, '<span class="u-highlight">$1</span>')

    return new nunjucks.runtime.SafeString(result)
  },

  collectionDefault: (collection, defaultValue = 'Not found') => {
    const isEmptyObjOrArray = (value) => {
      return ((isPlainObject(value) || isArray(value)) && isEmpty(value))
    }

    if (isArray(collection)) {
      return collection.slice().map((element) => {
        return !element || isEmptyObjOrArray(element) ? defaultValue : element
      })
    }
    if (isPlainObject(collection)) {
      const obj = Object.assign({}, collection)

      Object.keys(obj).forEach((key) => {
        if (!obj[key] || isEmptyObjOrArray(obj[key])) {
          obj[key] = defaultValue
        }
      })
      return obj
    }
  },

  removeNilAndEmpty: (collection) => {
    if (isArray(collection)) {
      return collection.filter(isNotEmpty)
    }
    if (isPlainObject(collection)) {
      return pickBy(collection, isNotEmpty)
    }
    return collection
  },

  formatCurrency: (value, format = currencyFormat) => {
    return numeral(value).format(format)
  },

  formatNumber: (number, locales = 'en-GB') => {
    return number.toLocaleString(locales)
  },

  formatDate: (value, format = longDateFormat) => {
    if (!value) {
      return value
    }
    const parsedDate = dateFns.parse(value)

    if (!dateFns.isValid(parsedDate)) { return value }
    return dateFns.format(parsedDate, format)
  },

  formatDateTime: (value, format = mediumDateTimeFormat) => {
    if (!value) {
      return value
    }

    const parsedDate = dateFns.parse(value)

    if (!dateFns.isValid(parsedDate)) { return value }

    return dateFns.format(parsedDate, format)
  },

  humanizeDuration: (value, measurement = 'minutes') => {
    const duration = moment.duration(value, measurement)
    const hrsSuffix = pluralise('hour', duration.hours())
    const minsSuffix = pluralise('minute', duration.minutes())

    return duration.format(`h [${hrsSuffix}], m [${minsSuffix}]`)
  },

  formatDuration: (value, format = 'hh:mm', measurement = 'minutes') => {
    return moment.duration(value, measurement).format(format, { trim: false })
  },

  fromNow: (value) => {
    return moment(value).fromNow()
  },

  arrayToLabelValues: (items) => {
    const result = []
    for (const item of items) {
      result.push({
        label: item,
        value: item,
      })
    }
    return result
  },

  applyClassModifiers (className, modifier) {
    if (!isString(className) || !(isString(modifier) || isArray(modifier))) { return className }

    const classModifier = flatten([modifier]).map(mod => `${className}--${mod}`).join(' ')

    return `${className} ${classModifier}`.trim()
  },
}

module.exports = filters
