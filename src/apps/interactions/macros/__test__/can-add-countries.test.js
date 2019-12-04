const canAddCountries = require('../can-add-countries')

const { THEMES } = require('../../constants')

const FLAG_NAME = 'interaction-add-countries'

describe('canAddCountries', () => {
  let flags = {}

  context('With the feature flag is true', () => {
    before(() => {
      flags[ FLAG_NAME ] = true
    })

    context('When the theme is export or other', () => {
      it('returns true', () => {
        expect(canAddCountries(THEMES.EXPORT, flags)).to.equal(true)
        expect(canAddCountries(THEMES.OTHER, flags)).to.equal(true)
      })
    })

    context('When the theme is something else', () => {
      it('returns false', () => {
        expect(canAddCountries(THEMES.INVESTMENT, flags)).to.equal(false)
        expect(canAddCountries('test', flags)).to.equal(false)
      })
    })
  })

  context('With the feature flag is false', () => {
    before(() => {
      flags[ FLAG_NAME ] = false
    })

    context('When the theme is export or other', () => {
      it('returns false', () => {
        expect(canAddCountries(THEMES.EXPORT, flags)).to.equal(false)
        expect(canAddCountries(THEMES.OTHER, flags)).to.equal(false)
      })
    })

    context('When the theme is something else', () => {
      it('returns false', () => {
        expect(canAddCountries(THEMES.INVESTMENT, flags)).to.equal(false)
        expect(canAddCountries('test', flags)).to.equal(false)
      })
    })
  })
})
