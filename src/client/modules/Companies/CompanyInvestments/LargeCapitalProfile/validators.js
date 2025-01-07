import { isValid } from 'date-fns'

import { parseDateWithYearMonth } from '../../../../utils/date'

export const validateDateWithinTheLastYear = (value, field, { values }) => {
  if (values && values.date) {
    const date = parseDateWithYearMonth(
      values.date.year,
      values.date.month,
      values.date.day
    )
    if (isValid(date)) {
      const now = new Date()
      const oneYearPrior = new Date()
      oneYearPrior.setFullYear(oneYearPrior.getFullYear() - 1)
      const result =
        date < oneYearPrior || date > now
          ? 'Date of most recent checks must be within the last 12 months.'
          : null
      return result
    }
  }
  return null
}
