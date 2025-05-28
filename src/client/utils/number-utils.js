export const decimal = (number) => {
  if (!number && number !== 0) {
    return null
  }

  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'decimal',
  })

  return formatter.format(number)
}

/* Used to display shorter version of a number.
 *
 * Example:
 * 500 = 500
 * 591 = 591
 * 1000 = 1K
 * 1111 = 1.11K
 * 9999 = 9.99K
 * 10795 = 10.79K
 * 1875896 = 1.87M
 *
 * Use formatAfter to determine the number after to use NumberFormat with.
 */
export const shortNumber = (
  number,
  formatAfter = 0,
  options = { roundingMode: 'trunc', maximumFractionDigits: 2 }
) => {
  if (number < formatAfter) {
    return number
  }

  if ((!number && number !== 0) || isNaN(number)) {
    return null
  }

  const formatter = new Intl.NumberFormat('en-GB', {
    notation: 'compact',
    ...options,
  })

  return formatter.format(number)
}

export const currencyGBP = (
  number,
  options = { maximumSignificantDigits: 21 }
) => {
  if (!number && number !== 0) {
    return null
  }

  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    ...options,
  })

  return formatter.format(number)
}

export const currencyUSD = (
  number,
  options = { maximumSignificantDigits: 21 }
) => {
  if (!number && number !== 0) {
    return null
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    ...options,
  })

  return formatter.format(number)
}

export const indexToOrdinal = (zeroBasedIndex) => {
  const naturalIndex = zeroBasedIndex + 1
  const units = naturalIndex % 10
  if (units > 3) {
    return naturalIndex + 'th'
  }

  const tens = ~~(naturalIndex / 10) % 10
  if (tens === 1) {
    return naturalIndex + 'th'
  }

  if (units === 1) {
    return naturalIndex + 'st'
  }
  if (units === 2) {
    return naturalIndex + 'nd'
  }
  if (units === 3) {
    return naturalIndex + 'rd'
  }
}

/**
 * Parse a string that has been formatted to a Number.
 * @param {string} stringNumber - the localized number
 * @param {string} locale - [optional] the locale that the number is represented in. Omit this parameter to use the en-GB locale.
 */
export const parseLocaleNumber = (stringNumber, locale = 'en-GB') => {
  if (!stringNumber.length) {
    return stringNumber
  }
  var thousandSeparator = Intl.NumberFormat(locale)
    .format(11111)
    .replace(/\p{Number}/gu, '')
  var decimalSeparator = Intl.NumberFormat(locale)
    .format(1.1)
    .replace(/\p{Number}/gu, '')

  return Number(
    stringNumber
      .replace(new RegExp('\\' + thousandSeparator, 'g'), '')
      .replace(new RegExp('\\' + decimalSeparator), '.')
  )
}
