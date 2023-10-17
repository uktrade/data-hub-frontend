import {
  addDays,
  isDateAfter,
  isDateInFuture,
  parseDateISO,
} from '../../utils/date'
import { transformDateObjectToDateString } from '../../transformers'

export const validateIfDateInFuture = (values) => {
  if (values?.year) {
    const deliveryDate = parseDateISO(transformDateObjectToDateString(values))
    const twentyDaysLater = addDays(new Date(), 20)

    return isDateAfter(deliveryDate, twentyDaysLater)
      ? null
      : 'Delivery date must be at least 21 days in the future'
  }
  return null
}

export const validateIfDateInPast = (values) =>
  isDateInFuture(transformDateObjectToDateString(values))
    ? 'Payment received date must be in the past'
    : null

export const validateAmountRecieved = (value, totalCost) => {
  const transformedValue = value * 100

  return transformedValue < totalCost
    ? 'The amount must be equal to or larger than the invoice amount'
    : null
}
