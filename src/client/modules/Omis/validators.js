import { addDays, isDateAfter, parseDateISO } from '../../utils/date'
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
