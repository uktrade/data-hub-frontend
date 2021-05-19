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

export const indexToOrdinal = (index) => {
  const naturalIndex = index + 1

  const units = naturalIndex % 10
  if (units > 3) {
    return index + 'th'
  }

  const tens = ~~(naturalIndex / 10) % 10
  if (tens === 1) {
    return index + 'th'
  }

  if (units === 1) {
    return index + 'st'
  }
  if (units === 2) {
    return index + 'nd'
  }
  if (units === 3) {
    return index + 'rd'
  }
}
