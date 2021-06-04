import moment from 'moment'
import {
  endOfToday,
  format as formatFNS,
  differenceInCalendarDays,
} from 'date-fns'

// These are the dateFns formats
export const DATE_FORMAT_LONG = 'dd MMM yyyy' // 01 Jun 2021
export const DATE_FORMAT_LONG_NO_DAY = 'MMMM yyyy' // June 2021
export const DATE_TIME_FORMAT = 'd MMM yyyy, h:mmaaa' // 1 Jun 2021, 2:45pm

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

export const format = (dateStr) => moment(dateStr).format('DD MMM YYYY')

export const today = () => {
  return formatFNS(new Date(), 'yyyy-MM-dd')
}

export const formatWithTime = (dateTimeStr) =>
  format(dateTimeStr, DATE_TIME_FORMAT)

export const isDateValid = (year, month, day, format = 'YYYY-MM-DD') => {
  const date = normaliseAndFormatDate(year, month, day)

  return moment(date, format, true).isValid()
}

export const isShortDateValid = (year, month) =>
  isDateValid(year, month, null, 'YYYY-MM')

export const transformValueForAPI = ({ year, month, day = 1 }) => {
  if (year && month && day) {
    return normaliseAndFormatDate(year, month, day)
  }

  return null
}

/**
 * Get the number of days to a given date as an integer.
 */
export const getDifferenceInDays = (dateIn) => {
  const today = endOfToday()
  return differenceInCalendarDays(new Date(dateIn), today)
}

/**
 * Get the number of days left or days ago that an input date is as a string.
 */
export const getDifferenceInDaysLabel = (dateIn) => {
  const difference = getDifferenceInDays(dateIn)
  return Math.abs(difference) === 1 ? difference + ' day' : difference + ' days'
}

export const getFinancialYearStart = (date) =>
  date.getMonth() < 3 ? date.getFullYear() - 1 : date.getFullYear()

export const generateFinancialYearLabel = (yearStart) =>
  `${yearStart}-${(yearStart + 1).toString().slice(-2)}`
