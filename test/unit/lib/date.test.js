const { parseDateString, formatISO8601DateTime } = require(`~/common/date`)

describe('Date tests', () => {
  describe('parse human dates', () => {
    it('should parse 10 Jan 2017', () => {
      const actual = parseDateString('10 Jan 2017')
      const expected = new Date(2017, 0, 10)
      expect(actual).to.deep.equal(expected)
    })
    it('should parse 10 January 2015', () => {
      const actual = parseDateString('10 January 2015')
      const expected = new Date(2015, 0, 10)
      expect(actual).to.deep.equal(expected)
    })
    it('should not parse fred smith', () => {
      const actual = parseDateString('Fred Smith')
      expect(actual).to.be.null
    })
  })
  describe('parse dates into an ISO8601 format', () => {
    it('should parse 2017-06-02T13:18:06.544524', () => {
      const actual = formatISO8601DateTime('2017-06-02T13:18:06.544524')
      const expected = '2017-06-02T13:18:06'
      expect(actual).to.equal(expected)
    })
    it('should parse 31 January 2019', () => {
      const actual = formatISO8601DateTime('31 January 2019')
      const expected = '2019-01-31T00:00:00'
      expect(actual).to.equal(expected)
    })
  })
})
