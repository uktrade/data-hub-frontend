import { isAfter, parseISO, differenceInCalendarMonths } from 'date-fns'

import {
  formatDate,
  DATE_FORMAT_COMPACT,
  DATE_FORMAT_DAY_MONTH,
} from '../../../../client/utils/date-utils'

export const formatStartAndEndDate = (startDate, endDate) => {
  if (startDate) {
    const startDateParsed = startDate ? parseISO(startDate) : startDate
    const endDateParsed = endDate ? parseISO(endDate) : endDate
    const startDateFormatted = startDate
      ? formatDate(startDate, DATE_FORMAT_COMPACT)
      : startDate
    const endDateFormatted = endDate ? formatDate(endDate) : endDate

    //When end date is missing or before start date
    if (!endDate || !isAfter(endDateParsed, startDateParsed)) {
      return startDateFormatted
    }
    //When start and end date are on same day
    if (startDateParsed.toDateString() === endDateParsed.toDateString()) {
      return startDateFormatted
    }
    // When start and end date are in the same month
    if (differenceInCalendarMonths(endDateParsed, startDateParsed) == 0) {
      return `${startDateParsed.getDate()} to ${endDateFormatted}`
    }
    // When start and end date are in the same year
    if (startDateParsed.getFullYear() === endDateParsed.getFullYear()) {
      return `${formatDate(startDate, DATE_FORMAT_DAY_MONTH)} to ${endDateFormatted}`
    }
    // When start and end date are in different years
    return `${startDateFormatted} to ${endDateFormatted}`
  }
  return null
}
