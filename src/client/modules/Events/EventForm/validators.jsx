import { isValid } from 'date-fns'

import { parseDateWithYearMonth } from '../../../utils/date'

export const validateStartDateBeforeOrEqualToEndDate = (
  value,
  field,
  { values }
) => {
  if (values && values.start_date && values.end_date) {
    const startDate = parseDateWithYearMonth(
      values.start_date.year,
      values.start_date.month,
      values.start_date.day
    )
    const endDate = parseDateWithYearMonth(
      values.end_date.year,
      values.end_date.month,
      values.end_date.day
    )
    if (isValid(startDate) && isValid(endDate)) {
      const result =
        startDate > endDate
          ? 'Enter a valid end date. This must be after the start date.'
          : null
      return result
    }
  }
  return null
}
