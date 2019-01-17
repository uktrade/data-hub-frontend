const { longDateFormat, mediumDateFormat, iso8601DateTimeFormat } = require('../config')
const format = require('date-fns/format')

function formatLongDate (dateString = []) {
  if (dateString) {
    return format(parseDateString(dateString), longDateFormat)
  }

  return null
}

function formatMediumDate (dateString = []) {
  if (dateString) {
    return format(parseDateString(dateString), mediumDateFormat)
  }

  return null
}

function formatISO8601DateTime (dateString = []) {
  if (dateString) {
    return format(parseDateString(dateString), iso8601DateTimeFormat)
  }

  return null
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
  formatMediumDate,
  formatISO8601DateTime,
  parseDateString,
}
