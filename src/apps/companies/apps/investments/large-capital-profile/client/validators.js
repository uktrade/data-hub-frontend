import { createDateFromObject } from '../../../../../../client/utils/date'

export const validateDateWithinOneYearFromToday = (
  value,
  field,
  { values }
) => {
  if (values && values.date) {
    const date = createDateFromObject(values.date)
    if (date) {
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
