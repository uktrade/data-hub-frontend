const { longDateFormat, mediumDateFormat } = require('../config')
const moment = require('moment')

function formatLongDate (date) {
  if (!date) {
    return null
  }
  return moment(date).format(longDateFormat)
}

function formatMediumDate (date) {
  if (!date) {
    return null
  }
  return moment(date).format(mediumDateFormat)
}

module.exports = {
  formatLongDate, formatMediumDate
}
