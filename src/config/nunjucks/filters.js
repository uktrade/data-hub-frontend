const nunjucks = require('nunjucks')

const Case = require('case')
const numeral = require('numeral')

const {
  assign,
  castArray,
  compact,
  concat,
  escape,
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
  camelCase,
} = require('lodash')

const { newlineToBr } = require('../../lib/text-formatting')
const { joinPaths } = require('../../lib/path')
const {
  formatDate: dateFormatter,
  DATE_FORMAT_FULL,
  DATE_FORMAT_MEDIUM_WITH_TIME,
} = require('../../client/utils/date-utils')

require('numeral/locales/en-gb')

numeral.locale('en-gb')

function isNotEmpty(value) {
  return (
    !isNil(value) &&
    !/^\s*$/.test(value) &&
    !(isPlainObject(value) && isEmpty(value))
  )
}

function pluralise(string, count, pluralisedWord) {
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
  lowerCase,
  kebabCase,
  camelCase,
  assign,
  castArray,
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
  joinPaths,
  sentenceCase: Case.sentence,

  escapeHtml(contents) {
    return newlineToBr(escape(contents))
  },

  reverseDate(dateString) {
    if (isNil(dateString)) {
      return
    }
    return dateString.split('/').reverse().join('/')
  },

  assignCopy(...args) {
    return assign({}, ...args)
  },

  split(value, separator) {
    if (!isString(value)) {
      return value
    }

    return value.split(separator)
  },

  highlight(searchResultText, searchTerm, matchFullWord = false) {
    if (
      !isString(searchResultText) ||
      !isString(searchTerm) ||
      !searchTerm.trim()
    ) {
      return searchResultText
    }

    try {
      // Remove regex characters from the search term
      // as they wont be in the result and will cause an error in the regular expression
      const cleanedSearchTerm = searchTerm.replace(/[.*+?^${}()<&|[\]\\]/g, '')
      const searchPattern = matchFullWord
        ? new RegExp(`\\b(${cleanedSearchTerm})\\b`, 'gi')
        : new RegExp(`(${cleanedSearchTerm})`, 'gi')

      const result = escape(searchResultText).replace(
        searchPattern,
        '<span class="u-highlight">$1</span>'
      )
      return new nunjucks.runtime.SafeString(result)
    } catch (error) {
      return searchResultText
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

  formatNumber: (number, locales = 'en-GB') => {
    return number.toLocaleString(locales)
  },

  formatDate: (value, format = DATE_FORMAT_FULL) =>
    dateFormatter(new Date(value), format),

  formatDateTime: (value, dateFormat = DATE_FORMAT_MEDIUM_WITH_TIME) =>
    dateFormatter(value, dateFormat),

  formatAddress: (address, join = ', ', featureFlag = false) => {
    if (!address) {
      return
    }

    return compact([
      address.line_1,
      address.line_2,
      address.town,
      address.county,
      address.postcode,
      address.area && featureFlag ? address.area.name : null,
      address.country?.name,
    ]).join(join)
  },

  applyClassModifiers(className, modifier) {
    if (!isString(className) || !(isString(modifier) || isArray(modifier))) {
      return className
    }

    const classModifier = flatten([modifier])
      .filter(isNotEmpty)
      .map((mod) => `${className}--${mod}`)
      .join(' ')

    return `${className} ${classModifier}`.trim()
  },
}

module.exports = filters
