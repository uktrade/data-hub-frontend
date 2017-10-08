const { format } = require('date-fns')

const getDateFor = ({ year, month, day }, formatPattern = 'D MMMM YYYY') => {
  return format(`${year}-${month}-${day}`, formatPattern)
}

module.exports = {
  getDateFor,
}
