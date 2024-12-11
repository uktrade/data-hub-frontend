import {
  formatDate,
  DATE_FORMAT_FULL,
  DATE_FORMAT_FULL_DAY,
  DATE_FORMAT_COMPACT,
  DATE_FORMAT_ISO,
  DATE_FORMAT_MEDIUM,
  DATE_FORMAT_MEDIUM_WITH_TIME,
  DATE_FORMAT_YEAR_MONTH,
  DATE_FORMAT_MONTH_YEAR,
  DATE_FORMAT_MONTH_ABBR_YEAR,
  DATE_FORMAT_DAY_MONTH,
  DATE_FORMAT_INTERACTION_TIMESTAMP,
} from '../date-utils'

describe('date-utils', () => {
  const date = '2024-12-04'
  const time = 'T10:41:45.425717Z'
  const dateAndTime = `${date}${time}`

  context('formatDate() - formatting ISO date strings', () => {
    it("should render '04 Dec 2024' (default format)", () => {
      expect(formatDate(date)).to.equal('04 Dec 2024') // the default
    })

    it("should render '04 Dec 2024' (DATE_FORMAT_COMPACT)", () => {
      expect(formatDate(date, DATE_FORMAT_COMPACT)).to.equal('04 Dec 2024')
    })

    it("should render '4 Dec 2024' (DATE_FORMAT_MEDIUM)", () => {
      expect(formatDate(dateAndTime, DATE_FORMAT_MEDIUM)).to.equal('4 Dec 2024')
    })

    it("should render '4 Dec 2024, 10:41am' (DATE_FORMAT_MEDIUM_WITH_TIME)", () => {
      expect(formatDate(dateAndTime, DATE_FORMAT_MEDIUM_WITH_TIME)).to.equal(
        '4 Dec 2024, 10:41am'
      )
    })

    it("should render '4 December 2024' (DATE_FORMAT_FULL)", () => {
      expect(formatDate(date, DATE_FORMAT_FULL)).to.equal('4 December 2024')
    })

    it("should render 'Wed, 04 Dec 2024' (DATE_FORMAT_FULL_DAY)", () => {
      expect(formatDate(date, DATE_FORMAT_FULL_DAY)).to.equal(
        'Wed, 04 Dec 2024'
      )
    })

    it("should render '2024-12-04' (DATE_FORMAT_ISO)", () => {
      expect(formatDate(date, DATE_FORMAT_ISO)).to.equal('2024-12-04')
    })

    it("should render '2024-12' (DATE_FORMAT_YEAR_MONTH)", () => {
      expect(formatDate(date, DATE_FORMAT_YEAR_MONTH)).to.equal('2024-12')
    })

    it("should render 'December 2024' (DATE_FORMAT_MONTH_YEAR)", () => {
      expect(formatDate(date, DATE_FORMAT_MONTH_YEAR)).to.equal('December 2024')
    })

    it("should render 'Dec 2024' (DATE_FORMAT_MONTH_ABBR_YEAR)", () => {
      expect(formatDate(date, DATE_FORMAT_MONTH_ABBR_YEAR)).to.equal('Dec 2024')
    })

    it("should render '04 Dec' (DATE_FORMAT_DAY_MONTH)", () => {
      expect(formatDate(date, DATE_FORMAT_DAY_MONTH)).to.equal('04 Dec')
    })

    it("should render '2024-12-4' (DATE_FORMAT_INTERACTION_TIMESTAMP)", () => {
      expect(formatDate(date, DATE_FORMAT_INTERACTION_TIMESTAMP)).to.equal(
        '2024-12-4'
      )
    })
  })
  context('formatDate() - formatting Date objects ', () => {
    it("should render '04 Dec 2024' (default format)", () => {
      expect(formatDate(new Date(date))).to.equal('04 Dec 2024') // the default
    })

    it("should render '04 Dec 2024' (DATE_FORMAT_COMPACT)", () => {
      expect(formatDate(new Date(date), DATE_FORMAT_COMPACT)).to.equal(
        '04 Dec 2024'
      )
    })

    it("should render '4 Dec 2024' (DATE_FORMAT_MEDIUM)", () => {
      expect(formatDate(new Date(dateAndTime), DATE_FORMAT_MEDIUM)).to.equal(
        '4 Dec 2024'
      )
    })

    it("should render '4 Dec 2024, 10:41am' (DATE_FORMAT_MEDIUM_WITH_TIME)", () => {
      expect(
        formatDate(new Date(dateAndTime), DATE_FORMAT_MEDIUM_WITH_TIME)
      ).to.equal('4 Dec 2024, 10:41am')
    })

    it("should render '4 December 2024' (DATE_FORMAT_FULL)", () => {
      expect(formatDate(new Date(date), DATE_FORMAT_FULL)).to.equal(
        '4 December 2024'
      )
    })

    it("should render 'Wed, 04 Dec 2024' (DATE_FORMAT_FULL_DAY)", () => {
      expect(formatDate(new Date(date), DATE_FORMAT_FULL_DAY)).to.equal(
        'Wed, 04 Dec 2024'
      )
    })

    it("should render '2024-12-04' (DATE_FORMAT_ISO)", () => {
      expect(formatDate(new Date(date), DATE_FORMAT_ISO)).to.equal('2024-12-04')
    })

    it("should render '2024-12' (DATE_FORMAT_YEAR_MONTH)", () => {
      expect(formatDate(new Date(date), DATE_FORMAT_YEAR_MONTH)).to.equal(
        '2024-12'
      )
    })

    it("should render 'December 2024' (DATE_FORMAT_MONTH_YEAR)", () => {
      expect(formatDate(new Date(date), DATE_FORMAT_MONTH_YEAR)).to.equal(
        'December 2024'
      )
    })

    it("should render 'Dec 2024' (DATE_FORMAT_MONTH_ABBR_YEAR)", () => {
      expect(formatDate(new Date(date), DATE_FORMAT_MONTH_ABBR_YEAR)).to.equal(
        'Dec 2024'
      )
    })

    it("should render '04 Dec' (DATE_FORMAT_DAY_MONTH)", () => {
      expect(formatDate(new Date(date), DATE_FORMAT_DAY_MONTH)).to.equal(
        '04 Dec'
      )
    })

    it("should render '2024-12-4' (DATE_FORMAT_INTERACTION_TIMESTAMP)", () => {
      expect(
        formatDate(new Date(date), DATE_FORMAT_INTERACTION_TIMESTAMP)
      ).to.equal('2024-12-4')
    })
  })
})
