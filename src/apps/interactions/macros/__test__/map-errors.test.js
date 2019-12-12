const faker = require('faker')

const mapErrors = require('../map-errors')

const EXPORT_COUNTRIES = 'export_countries'
const OUTPUT_FIELD = 'were_countries_discussed'

describe('mapErrors macro', () => {
  context('When EXPORT_COUNTRIES has an error', () => {
    it('Should map the error to the future countries of interest', () => {
      const errorMessage = faker.lorem.words(5)
      const input = {
        foo: 'bar',
        [EXPORT_COUNTRIES]: errorMessage,
      }

      expect(mapErrors(input)).to.deep.equal({
        foo: 'bar',
        [OUTPUT_FIELD]: errorMessage,
      })
    })
  })

  context('When EXPORT_COUNTRIES does not have an error', () => {
    it('Should return the errors', () => {
      const input = {
        foo: 'bar',
        bar: 'foo',
      }

      expect(mapErrors(input)).to.deep.equal(input)
    })
  })
})
