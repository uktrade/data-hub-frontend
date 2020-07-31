import moment from 'moment'

const DATE_FORMAT_LONG = 'YYYY-MM-DD'
const DATE_FORMAT_SHORT = 'YYYY-MM'

function padZero(value) {
  const parsedValue = parseInt(value, 10)
  if (Number.isNaN(parsedValue)) {
    return value
  }
  return parsedValue < 10 ? `0${parsedValue}` : parsedValue.toString()
}

function normaliseAndFormatDate(year, month, day) {
  const y = padZero(year)
  const m = padZero(month)
  const yearAndMonth = `${padZero(y)}-${padZero(m)}`
  return day ? `${yearAndMonth}-${padZero(day)}` : yearAndMonth
}

export default class DateUtils {
  static format(dateStr) {
    return moment(dateStr).format('DD MMM YYYY')
  }

  static formatWithTime(dateTimeStr) {
    return moment(dateTimeStr).format('D MMM YYYY, h:mma')
  }

  static isDateValid = (year, month, day, format = DATE_FORMAT_LONG) => {
    const date = normaliseAndFormatDate(year, month, day)
    return moment(date, format, true).isValid()
  }

  static isShortDateValid(year, month) {
    return DateUtils.isDateValid(year, month, null, DATE_FORMAT_SHORT)
  }

  static transformValueForAPI({ year, month, day = 1 }) {
    if (year && month && day) {
      return normaliseAndFormatDate(year, month, day)
    }

    return null
  }
}
