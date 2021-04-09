import faker from 'faker'

import { zeroPadNumber } from './utils'

/**
 * Fakes a number string with a given length (zero-padded)
 */
export const numberStringFaker = (length) =>
  // TODO: the max number should be based on the length here
  zeroPadNumber(faker.datatype.number({ max: 99999999 }, length))
