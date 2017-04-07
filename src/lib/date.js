const {longDateFormat} = require('../config')
const moment = require('moment')

function formatLongDate (date) {
  if (!date) {
    return null
  }
  return moment(date).format(longDateFormat)
}

module.exports = {
  formatLongDate
}
