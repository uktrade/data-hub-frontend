import { faker } from '../../../utils'

/**
 * Pad a number with leading zeroes to ensure it has the given length
 */
const zeroPadNumber = (number, length) => `${number}`.padStart(length, '0')

/**
 * Fakes a number string with a given length (zero-padded)
 */
const numberStringFaker = (length) =>
  zeroPadNumber(
    faker.number.int({ max: parseInt(''.padStart(length, '9')) }),
    length
  )

export { numberStringFaker }
