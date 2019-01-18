const { longDateFormat, iso8601DateTimeFormat } = require('../config')
const { format, parse } = require('date-fns')
const toString = require('lodash/toString')

function formatLongDate (dateString = []) {
  if (dateString) {
    return format(parseDateString(dateString), longDateFormat)
  }

  return null
}

function formatISO8601DateTime (date = '') {
  const invalid = toString(parse('SNAFUed'))
  let parsed = parse(date)
  return toString(parsed) === invalid ? null : format(date, iso8601DateTimeFormat)
}

function parseDateString (dateString) {
  if (dateString.indexOf('/') !== -1) {
    const parts = dateString.split('/')
    return new Date(parts[2], parts[1] - 1, parts[0])
  } else {
    const date = new Date(dateString)
    if (date.toString() !== 'Invalid Date') {
      return date
    }
  }
  return null
}

module.exports = {
  formatLongDate,
  formatISO8601DateTime,
  parseDateString,
}
