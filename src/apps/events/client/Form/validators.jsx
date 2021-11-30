const getDate = (value) => {
  const { day, month, year } = value
  const result = new Date(year, month, day)
  return result
}

export const validateStartDateBeforeOrEqualToEndDate = (
  value,
  field,
  { values }
) => {
  if (values && values.start_date && values.end_date) {
    const startDate = getDate(values.start_date)
    const endDate = getDate(values.end_date)
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
