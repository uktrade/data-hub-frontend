const {
  parseDateString,
  formatStartAndEndDate,
} = require('../../client/utils/date')

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

  describe('format start and end date', () => {
    describe('when there is no end date', () => {
      it('should return just the start date', () => {
        expect(formatStartAndEndDate('2022-05-02T20:09:14')).to.equal(
          '02 May 2022'
        )
      })
    })

    describe('when the end date is before the start', () => {
      it('should return just the start date', () => {
        expect(
          formatStartAndEndDate('2022-05-02T20:09:14', '2022-05-01T20:09:14')
        ).to.equal('02 May 2022')
      })
    })

    describe('when the end date is exactly the same as the start', () => {
      it('should return just the start date', () => {
        expect(
          formatStartAndEndDate('2022-05-02T20:09:14', '2022-05-02T20:09:14')
        ).to.equal('02 May 2022')
      })
    })

    describe('when the end date is the same day as the start', () => {
      it('should return just the start date', () => {
        expect(
          formatStartAndEndDate('2022-05-02T09:09:14', '2022-05-02T20:09:14')
        ).to.equal('02 May 2022')
      })
    })

    describe('when the end date after the start', () => {
      it('should return both dates formatted correctly', () => {
        expect(
          formatStartAndEndDate('2022-05-02T09:09:14', '2022-05-03T20:09:14')
        ).to.equal('02 to 03 May 2022')
      })
    })
  })
})
