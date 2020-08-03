export default class NumberUtils {
  static decimal(number) {
    if (!number && number !== 0) {
      return null
    }

    const formatter = new Intl.NumberFormat('en-GB', {
      style: 'decimal',
    })

    return formatter.format(number)
  }

  static currencyGBP(number, options = { maximumSignificantDigits: 21 }) {
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

  static currencyUSD(number, options = { maximumSignificantDigits: 21 }) {
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

  static roundToSignificantDigits(number, sigDig) {
    if (!number && number !== 0) {
      return null
    }

    return Number(number.toPrecision(sigDig))
  }
}
