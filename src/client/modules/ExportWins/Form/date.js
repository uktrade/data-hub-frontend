import {
  addDays,
  subMonths,
  isSameDay,
  startOfMonth,
  differenceInDays,
  isWithinInterval,
} from 'date-fns'

/**
 * Generates a random date within the range specified by startDate and endDate (inclusive).
 * @param {Date} startDate - The start date of the range.
 * @param {Date} endDate - The end date of the range.
 * @returns {Date} A random date within the specified range.
 * @throws {Error} If startDate is greater than endDate or if startDate and endDate are the same date.
 */
export const getRandomDateInRange = (startDate, endDate) => {
  if (isSameDay(startDate, endDate)) {
    throw new Error('Start date and end date cannot be the same.')
  }
  if (startDate > endDate) {
    throw new Error('Start date cannot be greater than end date.')
  }
  const daysDifference = differenceInDays(endDate, startDate)
  const randomNumberOfDays = Math.floor(Math.random() * (daysDifference + 1))
  return addDays(startDate, randomNumberOfDays)
}

/**
 * Returns the start date (1st day) of the month twelve months ago from the current date.
 * @returns {Date} The start date (1st day) of the month twelve months ago from the current date.
 */
export const getStartDateOfTwelveMonthsAgo = () => {
  return subMonths(startOfMonth(new Date()), 12)
}

/**
 * Checks if a given date falls within the last twelve months from the current date.
 * The last twelve months include the 1st of the month.
 * @param {Date} date - The date to be checked.
 * @returns {boolean} Returns true if the date falls within the last twelve months
 * from the current date, otherwise false.
 */
export const isWithinLastTwelveMonths = (date) => {
  return isWithinInterval(date, {
    start: getStartDateOfTwelveMonthsAgo(),
    end: new Date(),
  })
}
