import { isDateInFuture } from '../../utils/date'
import { transformDateObjectToDateString } from '../../transformers'

export const validateIfDateInFuture = (values) => {
  if (values?.year) {
    return isDateInFuture(transformDateObjectToDateString(values))
      ? null
      : 'Delivery date of work must be in the future'
  }
  return null
}
