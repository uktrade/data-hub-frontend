const {longDateFormat} = require('../config')
const moment = require('moment')

function formatLongDate (date) {
  return moment(date).format(longDateFormat)
}

module.exports = {
  formatLongDate
}
