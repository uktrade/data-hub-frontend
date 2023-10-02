const {
  isDateInFuture,
  transformValueForAPI,
} = require('../../../../utils/date')

export const validateIfDateInFuture = (values) =>
  isDateInFuture(transformValueForAPI(values))
    ? null
    : 'Enter a date in the future'

export const validateDaysRange = (value) =>
  value && (value < 1 || value > 365)
    ? 'Enter a number between 1 and 365'
    : null
