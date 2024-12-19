import { addDays, isAfter, isFuture, parseISO } from 'date-fns'

import { transformDateObjectToDateString } from '../../transformers'
import { EU_VAT_NUMBER_REGEX } from './constants'

export const validateIfDateInFuture = (values) => {
  if (values?.year) {
    const deliveryDate = parseISO(transformDateObjectToDateString(values))
    const twentyDaysLater = addDays(new Date(), 20)

    return isAfter(deliveryDate, twentyDaysLater)
      ? null
      : 'Delivery date must be at least 21 days in the future'
  }
  return null
}

export const validateIfDateInPast = (values) =>
  isFuture(transformDateObjectToDateString(values))
    ? 'Payment received date must be in the past'
    : null

export const validateAmountRecieved = (value, totalCost) => {
  const transformedValue = value * 100

  return transformedValue < totalCost
    ? 'The amount must be equal to or larger than the invoice amount'
    : null
}

export const validateVATNumber = (value) => {
  if (value != '' && !EU_VAT_NUMBER_REGEX.test(value)) {
    return 'VAT number must be a valid EU VAT number starting with the country code, for example IT12345678901 for Italy where "IT" is the country code'
  }
  return null
}

export const validateNumber = (value) => {
  if (!Number.isInteger(Number(value)) && value !== null) {
    return 'Enter a whole number'
  }
  return null
}
