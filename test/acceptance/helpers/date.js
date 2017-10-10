const { format } = require('date-fns')

/**
 * Gets date in year-month-day string format
 * @param year
 * @param month
 * @param day
 * @param formatPattern
 * @returns {*}
 */
const getDateFor = ({ year, month, day }, formatPattern = 'D MMMM YYYY') => {
  return format(`${year}-${month}-${day}`, formatPattern)
}

module.exports = {
  getDateFor,
}
