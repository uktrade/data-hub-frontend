import { isDateInFuture } from '../../utils/date'
import { transformDateObjectToDateString } from '../../transformers'

export const validateIfDateInFuture = (value, field, { values }) => {
  if (values && values.delivery_date) {
    if (values.delivery_date.year != '') {
      return isDateInFuture(
        transformDateObjectToDateString(values.delivery_date)
      )
        ? null
        : 'Delivery date of work must be in the future'
    }
  }
  return null
}
