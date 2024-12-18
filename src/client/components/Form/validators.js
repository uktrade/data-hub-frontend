import { isFuture, parseISO } from 'date-fns'

import { transformDateObjectToDateString } from '../../transformers'

const EMAIL_PATTERN =
  /(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

const IS_NUMBER = /^[0-9]*$/

export const email = (x) =>
  EMAIL_PATTERN.test(x)
    ? null
    : 'Enter an email address in the correct format, like name@example.com'

export const number = (x, errorMessage) =>
  !x || IS_NUMBER.test(x) ? null : errorMessage

export const validateIfDateInPast = (date) => {
  const transformedDate = transformDateObjectToDateString(date)

  return transformedDate
    ? isFuture(parseISO(transformedDate))
      ? 'Actual land date cannot be in the future'
      : null
    : null
}
