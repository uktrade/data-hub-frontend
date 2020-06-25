const { convertUsdToGbp, convertGbpToUsd } = require('../currency')
const {
  EXCHANGE_RATE_USD_TO_GBP,
  EXCHANGE_RATE_GBP_TO_USD,
} = require('../constants')

function getExpectedGbpValue(usd) {
  return usd * EXCHANGE_RATE_USD_TO_GBP
}

function getExpectedUsdValue(gbp) {
  return gbp * EXCHANGE_RATE_GBP_TO_USD
}

describe('Currency test', () => {
  describe('USD to GBP', () => {
    it('should handle null', () => {
      expect(convertUsdToGbp(null)).to.equal(null)
    })

    it('should handle undefined', () => {
      expect(convertUsdToGbp(undefined)).to.equal(undefined)
    })

    it('should handle NaN', () => {
      expect(convertUsdToGbp(NaN)).to.deep.equal(NaN)
    })

    it('should convert zero', () => {
      expect(convertUsdToGbp(0)).to.equal(0)
    })

    it('should convert negative values -$100', () => {
      const expected = getExpectedGbpValue(-100)
      expect(convertUsdToGbp(-100)).to.equal(expected)
    })

    it('should convert $1', () => {
      expect(convertUsdToGbp(1)).to.equal(EXCHANGE_RATE_USD_TO_GBP)
    })

    it('should convert $1M', () => {
      const expected = getExpectedGbpValue(1000000)
      expect(convertUsdToGbp(1000000)).to.equal(expected)
    })
  })

  describe('GBP to USD', () => {
    it('should handle null', () => {
      expect(convertGbpToUsd(null)).to.equal(null)
    })

    it('should handle undefined', () => {
      expect(convertGbpToUsd(undefined)).to.equal(undefined)
    })

    it('should handle NaN', () => {
      expect(convertGbpToUsd(NaN)).to.deep.equal(NaN)
    })

    it('should convert zero', () => {
      expect(convertGbpToUsd(0)).to.equal(0)
    })

    it('should convert negative values -$100', () => {
      const expected = getExpectedUsdValue(-100)
      expect(convertGbpToUsd(-100)).to.equal(expected)
    })

    it('should convert £1', () => {
      expect(convertGbpToUsd(1)).to.equal(EXCHANGE_RATE_GBP_TO_USD)
    })

    it('should convert £1M', () => {
      const expected = getExpectedUsdValue(1000000)
      expect(convertGbpToUsd(1000000)).to.equal(expected)
    })
  })
})
