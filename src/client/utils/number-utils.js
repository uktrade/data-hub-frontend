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
