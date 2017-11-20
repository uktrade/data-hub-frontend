const faker = require('faker')
const { format, getYear, addYears, getDaysInMonth } = require('date-fns')

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

/**
 * generates a random future date
 * @returns {{year, month, day}}
 */
const generateFutureDate = () => {
  const nextYear = getYear(addYears(Date.now(), 1))
  const year = faker.random.number({ min: nextYear, max: nextYear + 40 })
  const month = faker.random.number({ min: 1, max: 12 })
  const day = faker.random.number({ min: 1, max: getDaysInMonth(new Date(year, month)) })

  return {
    year,
    month,
    day,
  }
}

module.exports = {
  getDateFor,
  generateFutureDate,
}
