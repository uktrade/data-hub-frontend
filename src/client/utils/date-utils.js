import moment from 'moment'
import { endOfToday, differenceInCalendarDays } from 'date-fns'

const DATE_FORMAT_LONG = 'YYYY-MM-DD'
const DATE_FORMAT_SHORT = 'YYYY-MM'

const padZero = (value) => {
  const parsedValue = parseInt(value, 10)
  if (Number.isNaN(parsedValue)) {
    return value
  }
  return parsedValue < 10 ? `0${parsedValue}` : parsedValue.toString()
}

const normaliseAndFormatDate = (year, month, day) => {
  const y = padZero(year)
  const m = padZero(month)
  const yearAndMonth = `${padZero(y)}-${padZero(m)}`
  return day ? `${yearAndMonth}-${padZero(day)}` : yearAndMonth
}

export const format = (dateStr) => {
  return moment(dateStr).format('DD MMM YYYY')
}

export const formatWithTime = (dateTimeStr) => {
  return moment(dateTimeStr).format('D MMM YYYY, h:mma')
}

export const isDateValid = (year, month, day, format = DATE_FORMAT_LONG) => {
  const date = normaliseAndFormatDate(year, month, day)
  return moment(date, format, true).isValid()
}

export const isShortDateValid = (year, month) => {
  return isDateValid(year, month, null, DATE_FORMAT_SHORT)
}

export const transformValueForAPI = ({ year, month, day = 1 }) => {
  if (year && month && day) {
    return normaliseAndFormatDate(year, month, day)
  }

  return null
}

/**
 * Get the number of days left or days ago that an input date is as a string.
 */
export const getDifferenceInDays = (dateIn) => {
  const today = endOfToday()
  const difference = differenceInCalendarDays(dateIn, today)
  return difference === 1
    ? difference + ' day'
    : difference < 0
    ? difference * -1 + ' days ago'
    : difference + ' days'
}
