import {
  convertDateToFieldDateObject,
  convertDateToFieldShortDateObject,
} from '../date'

describe('convertDateToFieldShortDateObject', () => {
  context('when called with an invalid date', () => {
    it('should return an empty short date format object', () => {
      expect(convertDateToFieldShortDateObject('ab')).to.deep.equal({
        month: '',
        year: '',
      })
    })
  })

  context('when called with a valid date', () => {
    it('should return a short date format object with month and year correctly populated', () => {
      expect(
        convertDateToFieldShortDateObject('2025-05-07T12:44:54')
      ).to.deep.equal({
        month: 5,
        year: 2025,
      })
    })
  })
})

describe('convertDateToFieldDateObject', () => {
  context('when called with an invalid date', () => {
    it('should return an empty short date format object', () => {
      expect(convertDateToFieldDateObject('ab')).to.deep.equal({
        day: '',
        month: '',
        year: '',
      })
    })
  })

  context('when called with a valid date', () => {
    it('should return a short date format object with month and year correctly populated', () => {
      expect(convertDateToFieldDateObject('2025-05-07T12:44:54')).to.deep.equal(
        {
          day: 7,
          month: 5,
          year: 2025,
        }
      )
    })
  })
})
