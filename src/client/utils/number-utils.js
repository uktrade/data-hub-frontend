export const decimal = (number) => {
  if (!number && number !== 0) {
    return null
  }

  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'decimal',
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
