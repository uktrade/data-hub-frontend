const { mapErrorMessages } = require('../transformers')

describe('mapErrorMessages', () => {
  context('when errors is null', () => {
    it('should return null', () => {
      expect(mapErrorMessages(null)).to.be.null
    })
  })
  context('when field error is null', () => {
    it('should return the field error with a fallback error message', () => {
      expect(
        mapErrorMessages({
          null_value: null,
        })
      ).to.deep.equal({
        null_value: 'An error occured on field null value',
      })
    })
  })
  context('when field error is an empty array', () => {
    it('should return the field error with a fallback error message', () => {
      expect(
        mapErrorMessages({
          empty_error: [],
        })
      ).to.deep.equal({
        empty_error: 'An error occured on field empty error',
      })
    })
  })
  context('when field error is an not an array', () => {
    it('should return the field error with a fallback error message', () => {
      expect(
        mapErrorMessages({
          number_error: 1,
        })
      ).to.deep.equal({
        number_error: 'An error occured on field number error',
      })
    })
  })
  context('when error is a required field', () => {
    it('should return the field error with the object key as part of the error message', () => {
      expect(
        mapErrorMessages({
          company: ['This field is required.'],
          some_longer_name: ['This field is required.'],
          required_with_other_error: [
            'This field is required.',
            'Some other error message.',
          ],
        })
      ).to.deep.equal({
        company: 'The company field is required.',
        some_longer_name: 'The some longer name field is required.',
        required_with_other_error:
          'The required with other error field is required. Some other error message.',
      })
    })
  })
  context('when error is not a required field', () => {
    it('should return the error messages concatonated into a single string', () => {
      expect(
        mapErrorMessages({
          another_error_key: [
            'This is a generic error.',
            'This is not a valid FK.',
          ],
        })
      ).to.deep.equal({
        another_error_key: 'This is a generic error. This is not a valid FK.',
      })
    })
  })
})
