import { createDateFromObject } from '../../../utils/date'

export const validateStartDateBeforeOrEqualToEndDate = (
  value,
  field,
  { values }
) => {
  if (values && values.start_date && values.end_date) {
    const startDate = createDateFromObject(values.start_date)
    const endDate = createDateFromObject(values.end_date)
    if (startDate && endDate) {
      const result =
        startDate > endDate
          ? 'Enter a valid end date. This must be after the start date.'
          : null
      return result
    }
  }
  return null
}
