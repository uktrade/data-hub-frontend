const nunjucks = require('nunjucks')

const {
  assign,
  concat,
  isArray,
  isPlainObject,
  isEmpty,
  isNull,
  isString,
  isFunction,
  pickBy,
  filter,
  isNil,
  keys,
  values,
  flatten,
  map,
  mapValues,
} = require('lodash')

function isNotEmpty (value) {
  return !isNil(value) && !/^\s*$/.test(value) && !(isPlainObject(value) && isEmpty(value))
}

const filters = {
  stringify: JSON.stringify,
  assign,
  concat,
  filter,
  values,
  keys,
  flatten,
  map,
  mapValues,
  isArray,
  isNull,

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

  pluralise: (string, count, pluralisedWord) => {
    if (parseInt(count, 10) !== 1) {
      if (pluralisedWord) {
        string = pluralisedWord
      } else {
        string += 's'
      }
    }

    return string
  },

  formatNumber: (number, locales = 'en-GB') => {
    return number.toLocaleString(locales)
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

  applyMacro (config) {
    function renderMacro (macroConfig) {
      return map(macroConfig, (props, name) => {
        const macro = this.ctx[name]
        if (isFunction(macro)) {
          return macro(props)
        }
      })[0]
    }

    if (isArray(config)) {
      return config.map(renderMacro.bind(this))
    }

    return renderMacro.call(this, config)
  },
}

module.exports = filters
