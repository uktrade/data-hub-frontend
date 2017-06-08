const nunjucks = require('nunjucks')
const {
  isArray,
  isPlainObject,
  pickBy,
  isNil,
} = require('lodash')

const filters = {
  stringify: JSON.stringify,

  highlight: (string, searchTerm) => {
    const regEx = new RegExp(`(${searchTerm})`, 'gi')

    return new nunjucks.runtime.SafeString(
      string.replace(regEx, '<span class="u-highlight">$1</span>')
    )
  },

  removeFalsey: (collection) => {
    if (isArray(collection)) {
      return collection.filter(item => item)
    }
    if (isPlainObject(collection)) {
      return pickBy(collection, (value) => !isNil(value) && !/^\s*$/.test(value))
    }
    return collection
  },

  pluralise: (string, count, pluralisedWord) => {
    if (count !== 1) {
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
}

module.exports = filters
