/**
 * Picks a random item from an array
 */
export const randomChoice = (list) =>
  list[Math.floor(Math.random() * list.length)]

/**
 * Pad a number with leading zeroes to ensure it has the given length
 */
export const zeroPadNumber = (number, length) =>
  `${number}`.padStart(length, '0')
